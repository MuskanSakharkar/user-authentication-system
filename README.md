# User Authentication System

User Authentication System is a full-stack authentication web application designed to provide secure user registration, login, authorization, and protected profile access.

The application demonstrates a complete frontend-to-backend authentication workflow using React, Express.js, JWT, bcryptjs, and MongoDB Atlas. Users can create accounts, securely log in, access protected profile information, inspect authentication tokens, and log out of the application.

## Project Links

* **Live Demo:** [https://user-authentication-system-production-afa3.up.railway.app](https://user-authentication-system-production-afa3.up.railway.app)
* **GitHub Repository:** [https://github.com/MuskanSakharkar/user-authentication-system](https://github.com/MuskanSakharkar/user-authentication-system)

## Features

### User Registration

* Register using:

  * Full Name
  * Email
  * Password
  * Password Confirmation
* Email format validation
* Password strength validation
* Password confirmation validation
* Password hashing using `bcryptjs`
* Prevents duplicate email registrations
* Stores registered users in MongoDB Atlas

### User Login

* Login using registered email and password
* Validates credentials against stored password hashes
* Uses `bcrypt.compare()` for password verification
* Generates a signed JWT after successful authentication
* Password visibility toggle

### JWT Authentication

* JWT-based authentication for user sessions
* JWT token storage on the client
* Bearer token authentication
* Express authorization middleware for protected routes
* Token verification using `jsonwebtoken`
* Interactive JWT Inspector for viewing decoded token payloads

### Protected Profile

* Protected user profile page
* Retrieves authenticated user information through the protected API
* Access is granted only when a valid JWT is provided

### Session Management

* Authentication token is maintained on the client
* Logout functionality clears the authentication token
* Unauthenticated users are redirected to the login interface

## Technology Stack

### Frontend

* React 19
* TypeScript
* HTML5
* CSS3
* Tailwind CSS v4
* Lucide Icons
* Motion

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication and Security

* JSON Web Token (`jsonwebtoken`)
* `bcryptjs`
* JWT Authorization Middleware
* Environment Variables

### API and Development Tools

* RESTful API
* Vite
* tsx
* esbuild
* dotenv
* CORS

## Project Structure

```text
user-authentication-system/
│
├── backend/
│   ├── models/
│   │   └── User.ts
│   ├── routes/
│   │   └── authRoutes.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   └── db.ts
│
├── src/
│   ├── components/
│   │   ├── Register.tsx
│   │   ├── Login.tsx
│   │   └── Welcome.tsx
│   │
│   ├── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── server.ts
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## REST API

The Express backend provides RESTful endpoints for user registration, authentication, protected profile access, and server health monitoring.

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| POST   | `/api/auth/register` | Register a new user                       |
| POST   | `/api/auth/login`    | Authenticate an existing user             |
| GET    | `/api/auth/profile`  | Retrieve the authenticated user's profile |
| GET    | `/api/health`        | Check API and server health               |

### Register User

**POST `/api/auth/register`**

Example request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Example@123"
}
```

### Login User

**POST `/api/auth/login`**

Example request:

```json
{
  "email": "john@example.com",
  "password": "Example@123"
}
```

A successful login returns a JWT token along with the authenticated user's information.

### Get Protected Profile

**GET `/api/auth/profile`**

The request requires a valid JWT in the authorization header:

```text
Authorization: Bearer <JWT_TOKEN>
```

The endpoint returns the authenticated user's profile information.

### Health Check

**GET `/api/health`**

Returns the current backend and database connection status.

## Database Schema

The application uses **MongoDB Atlas** with **Mongoose** for persistent user data storage.

### Database

```text
Database: auth_system
Collection: users
```

### User Fields

| Field       | Type   | Description                 |
| ----------- | ------ | --------------------------- |
| `name`      | String | User's full name            |
| `email`     | String | User's unique email address |
| `password`  | String | Hashed user password        |
| `createdAt` | Date   | Account creation timestamp  |
| `updatedAt` | Date   | Last update timestamp       |

Passwords are hashed using `bcryptjs` before being stored in the database.

## Authentication Flow

The authentication process follows this flow:

```text
User Registration
       ↓
POST /api/auth/register
       ↓
Validate User Information
       ↓
Hash Password with bcryptjs
       ↓
Store User in MongoDB Atlas
       ↓
Registration Successful
       ↓
User Login
       ↓
POST /api/auth/login
       ↓
Verify Email and Password
       ↓
Generate JWT
       ↓
Store JWT on Client
       ↓
Access Protected Profile
       ↓
GET /api/auth/profile
       ↓
JWT Authorization Middleware
       ↓
Verify Token
       ↓
Return User Information
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MuskanSakharkar/user-authentication-system.git
cd user-authentication-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auth_system
JWT_SECRET=your_custom_jwt_secret
PORT=3000
```

For MongoDB Atlas, replace `MONGODB_URI` with your MongoDB Atlas connection string.

**Do not commit or upload the `.env` file to GitHub.**

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### 5. Build for Production

```bash
npm run build
```

The production application can then be started using:

```bash
npm start
```

## How to Use

### Create an Account

1. Open the application.
2. Enter your full name.
3. Enter a valid email address.
4. Create a password.
5. Confirm the password.
6. Submit the registration form.

The password is securely hashed before being stored in MongoDB.

### Login

1. Enter your registered email address.
2. Enter your password.
3. Submit the login form.
4. After successful authentication, a JWT is generated.
5. The application provides access to the protected profile page.

### View Profile

After logging in, the protected profile page displays the authenticated user's information retrieved through the protected API endpoint.

### JWT Inspector

The JWT Inspector allows the authenticated user to inspect the decoded JWT payload generated during login.

### Logout

Select the logout option to clear the stored authentication token and return to the unauthenticated login interface.

## Data Flow

The application follows a frontend-to-backend authentication architecture:

```text
React Frontend
      ↓
REST API
      ↓
Express.js Backend
      ↓
Authentication Middleware
      ↓
JWT Verification
      ↓
Mongoose
      ↓
MongoDB Atlas
```

## Security Practices

The application implements several security practices:

* Passwords are hashed using `bcryptjs` before database storage.
* Plain-text passwords are never stored.
* JWTs are signed using a server-side secret.
* Protected routes require valid JWT authentication.
* Authorization middleware verifies Bearer tokens.
* Email addresses are normalized before storage.
* Database credentials are stored using environment variables.
* JWT secrets are stored using environment variables.
* Password fields are excluded from returned user data.

## Deployment

The application is deployed using **Railway** with **MongoDB Atlas** as the production database.

The following environment variables are configured in the Railway deployment:

```text
MONGODB_URI
JWT_SECRET
```

The deployed application is available at:

```text
https://user-authentication-system-production-afa3.up.railway.app
```

## Development

The project separates frontend components, backend routes, authentication middleware, and database logic to maintain a clear full-stack architecture.

React handles the user interface, Express.js provides the REST API, JWT manages authentication, and MongoDB Atlas provides persistent user data storage.

## Project Objective

The project demonstrates practical implementation of:

* React-based frontend development
* User registration and login
* Password hashing
* JWT authentication
* Protected API routes
* Express.js backend development
* RESTful API development
* MongoDB Atlas integration
* Mongoose data modeling
* Authentication middleware
* Environment variable configuration
* Frontend and backend communication
* Full-stack application architecture

## Author

**Muskan Sakharkar**

BSc IT Student

## License

This project was developed for educational and portfolio purposes.
