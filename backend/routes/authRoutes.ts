import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user, hash password with bcryptjs, store in MongoDB
 * @access  Public
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email is already registered. Please login instead.',
      });
      return;
    }

    // 3. Hash password using bcryptjs
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Save user in MongoDB
    const newUser = new User({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    // 5. Success response
    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account has been created.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again.',
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user, verify password with bcryptjs, return JWT
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Find user in MongoDB
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // 3. Verify password with bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // 4. Generate JWT
    const jwtSecret = process.env.JWT_SECRET || 'auth_system_jwt_secret_key_2026_secure';
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '24h',
    });

    // 5. Response
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.',
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get protected user profile using JWT token
 * @access  Private (JWT Protected)
 */
router.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
      });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Profile endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile information.',
    });
  }
});

/**
 * @route   GET /api/health
 * @desc    System health check
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response): void => {
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  
  const dbStatus = dbStateMap[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    status: 'ok',
    message: 'Backend API is running smoothly',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      connected: mongoose.connection.readyState === 1,
    },
  });
});

export default router;
