# Level 3 – Task 2: User Authentication System

A professional, full-stack **User Authentication System** built for internship Level 3 – Task 2. This application features real user registration, login, bcryptjs password hashing, JWT authorization middleware, Mongoose / MongoDB Atlas storage, and protected route access.

---

## 🚀 Features

- **User Registration**:
  - Full Name, Email, Password, and Password Confirmation fields.
  - Password strength and email format validation.
  - Hashes passwords securely using `bcryptjs` before persisting to MongoDB.
  - Prevents duplicate email registrations with clear user feedback.

- **User Login**:
  - Validates user credentials against MongoDB stored hashes using `bcrypt.compare()`.
  - Generates a signed **JSON Web Token (JWT)** upon successful login.
  - Password visibility toggle controls for improved user experience.

- **JWT Authentication & Protected Routes**:
  - Express authorization middleware (`authMiddleware.ts`) extracts and verifies `Bearer <token>` headers.
  - Protected `GET /api/auth/profile` route returns profile information for authenticated users.
  - Interactive **JWT Inspector** on the frontend allows inspecting decoded token payloads.

- **Session Management & Logout**:
  - JWT token saved securely in client storage.
  - One-click logout clears authentication tokens and redirects unauthenticated users.

---

## 🛠️ Technology Stack

### Frontend
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Motion** (Animations & Transitions)
- **Vite**

### Backend
- **Node.js** & **Express.js**
- **MongoDB Atlas** & **Mongoose** (with in-memory fallback for instant dev/testing)
- **JSON Web Tokens (`jsonwebtoken`)**
- **Password Security (`bcryptjs`)**
- **Environment Variables (`dotenv`)** & **CORS**

---

## 🔑 Authentication Flow

```text
               REGISTER PAGE
                     ↓
          User enters name/email/password
                     ↓
             POST /api/auth/register
                     ↓
              Express Backend
                     ↓
          Password hashed with bcryptjs
                     ↓
              User saved in MongoDB
                     ↓
          Registration successful message
                     ↓
                 LOGIN PAGE
                     ↓
          User enters email/password
                     ↓
              POST /api/auth/login
                     ↓
          Password verified with bcryptjs
                     ↓
               JWT generated
                     ↓
          JWT stored on frontend
                     ↓
          Protected Welcome Page
                     ↓
       GET /api/auth/profile with JWT
                     ↓
          JWT authentication middleware
                     ↓
          User information returned
```

---

## 📡 REST API Endpoints

### 1. Register User
- **URL**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Example@123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful! Your account has been created.",
    "user": {
      "id": "60d5ec49f1b2c80015f8e4d1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-08-11T05:50:00.000Z"
    }
  }
  ```

### 2. Login User
- **URL**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Example@123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c80015f8e4d1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-08-11T05:50:00.000Z"
    }
  }
  ```

### 3. Get Protected Profile
- **URL**: `GET /api/auth/profile`
- **Headers**:
  ```text
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "60d5ec49f1b2c80015f8e4d1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-08-11T05:50:00.000Z",
      "updatedAt": "2026-08-11T05:50:00.000Z"
    }
  }
  ```

### 4. Backend Health Check
- **URL**: `GET /api/health`
- **Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "message": "Backend API is running smoothly",
    "timestamp": "2026-08-11T05:50:00.000Z",
    "database": {
      "status": "connected",
      "connected": true
    }
  }
  ```

---

## 🗄️ Database Schema

### Database: `auth_system`
### Collection: `users`

```typescript
UserSchema = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Encrypted with bcryptjs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 📁 Project Structure

```text
.
├── backend/
│   ├── models/
│   │   └── User.ts            # Mongoose User Schema
│   ├── routes/
│   │   └── authRoutes.ts      # REST API endpoints (register, login, profile)
│   ├── middleware/
│   │   └── authMiddleware.ts  # JWT verification middleware
│   └── db.ts                  # MongoDB Mongoose connection
│
├── src/
│   ├── components/
│   │   ├── Register.tsx       # User registration page component
│   │   ├── Login.tsx          # User login page component
│   │   └── Welcome.tsx        # Protected user profile dashboard
│   ├── types.ts               # Shared TypeScript interfaces
│   ├── App.tsx                # Main view state manager & header/footer
│   ├── main.tsx               # React application mounting point
│   └── index.css              # Tailwind CSS styles
│
├── server.ts                  # Node Express + Vite integration server
├── .env                       # Local environment secrets
├── .env.example               # Environment variables template
├── package.json               # NPM scripts and dependencies
└── README.md                  # Comprehensive project documentation
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy `.env.example`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auth_system?retryWrites=true&w=majority
JWT_SECRET=your_custom_jwt_secret_key
PORT=3000
```
*Note: If `MONGODB_URI` is left blank, the application automatically boots an in-memory MongoDB server for zero-config testing.*

### 3. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 🔒 Security Practices Demonstrated

1. **Password Hashing**: Raw passwords are salted and hashed using `bcryptjs` with 10 salt rounds before saving to MongoDB. Plain text passwords are never stored or logged.
2. **Stateless JWT Authorization**: Tokens signed with a secure secret payload are verified using custom Express middleware (`authMiddleware.ts`).
3. **Data Sanitization**: Mongoose JSON transform automatically strips `password` fields when returning user objects.
4. **Email Normalization**: Lowercases and trims email addresses to prevent case-sensitivity duplicate account issues.
