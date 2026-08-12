import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './backend/db.js';
import authRoutes from './backend/routes/authRoutes.js';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Enable CORS
  app.use(cors());

  // Parse JSON bodies
  app.use(express.json());

  // Connect to Database (MongoDB Atlas or In-Memory fallback)
  await connectDB();

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Backend server is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Auth REST API Routes
  app.use('/api/auth', authRoutes);

  // Setup Vite development server middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});
