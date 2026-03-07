# Authentication Setup Guide

## Overview
Professional login system with Google OAuth 2.0 authentication has been added to the Course Enrollment System.

## Features Added
- ✅ Professional Login/Register Page
- ✅ JWT Token-based Authentication
- ✅ Google OAuth 2.0 Integration
- ✅ Protected Routes
- ✅ User Session Management
- ✅ Automatic Token Refresh
- ✅ Logout Functionality

---

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd Backend
mvn clean install
```

This will install:
- Spring Security
- Spring OAuth2 Client
- JWT (JSON Web Token) libraries

### 2. Configure Google OAuth 2.0

#### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen:
   - Application name: EduFlow
   - Authorized domains: localhost
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:8080/login/oauth2/code/google`
7. Copy the Client ID and Client Secret

#### Step 2: Update application.properties

Edit `Backend/src/main/resources/application.properties`:

```properties
# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID_HERE
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET_HERE
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/{registrationId}
```

Replace `YOUR_GOOGLE_CLIENT_ID_HERE` and `YOUR_GOOGLE_CLIENT_SECRET_HERE` with your actual credentials.

### 3. Start the Application

#### Start MongoDB
```bash
mongod --dbpath /data/db
```

#### Start Backend
```bash
cd Backend
mvn spring-boot:run
```

#### Start Frontend
```bash
cd Frontend
npm install  # if not already installed
npm run dev
```

---

## How It Works

### Authentication Flow

1. **Registration**:
   - User fills registration form (name, email, password)
   - Password is encrypted using BCrypt
   - User data saved to MongoDB
   - JWT token generated and returned
   - User redirected to dashboard

2. **Login**:
   - User enters email and password
   - Credentials verified against database
   - JWT token generated and returned
   - Token stored in localStorage
   - User redirected to dashboard

3. **Google OAuth**:
   - User clicks "Continue with Google"
   - Redirected to Google login page
   - After successful login, redirected back to app
   - JWT token generated automatically
   - User redirected to dashboard

4. **Protected Routes**:
   - All routes except `/login` require authentication
   - JWT token sent with every API request
   - If token invalid/expired, user redirected to login

5. **Logout**:
   - Click user profile in sidebar
   - Select "Logout"
   - Token removed from localStorage
   - Redirected to login page

---

## API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65e1abd...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65e1abd...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Protected Endpoints

All existing endpoints now require authentication:
- Students: `/api/students/*`
- Courses: `/api/courses/*`
- Enrollments: `/api/enrollments/*`

Add JWT token to request headers:
```
Authorization: Bearer <your-jwt-token>
```

---

## File Structure

### Frontend Files Added/Modified

```
Frontend/src/
├── pages/
│   └── Login.jsx                    # Login/Register page
├── components/
│   └── ProtectedRoute.jsx          # Route protection component
├── services/
│   ├── authService.js              # Authentication service
│   └── api.js                      # Updated with JWT interceptors
├── App.jsx                         # Updated with auth routes
└── index.css                       # Login page styles
```

### Backend Files Added

```
Backend/src/main/java/com/example/coursebooking/
├── model/
│   └── User.java                   # User entity
├── repository/
│   └── UserRepository.java         # User data access
├── dto/
│   ├── AuthRequest.java            # Login/Register request DTO
│   └── AuthResponse.java           # Auth response DTO
├── security/
│   ├── JwtUtil.java                # JWT token utility
│   ├── JwtAuthenticationFilter.java # JWT filter
│   └── CustomUserDetailsService.java # User details service
├── config/
│   └── SecurityConfig.java         # Security configuration
├── service/
│   └── AuthService.java            # Authentication service
└── controller/
    └── AuthController.java         # Auth endpoints
```

---

## Testing

### Test Registration
1. Open `http://localhost:5173`
2. Click "Register"
3. Fill form and submit
4. Should redirect to dashboard

### Test Login
1. Open `http://localhost:5173`
2. Enter credentials
3. Click "Login"
4. Should redirect to dashboard

### Test Google Login
1. Open `http://localhost:5173`
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to dashboard

### Test Protected Routes
1. Logout from application
2. Try to access `http://localhost:5173/courses`
3. Should redirect to login page

### Test Logout
1. Login to application
2. Click user profile in sidebar
3. Click "Logout"
4. Should redirect to login page

---

## Security Features

- ✅ Password encryption using BCrypt
- ✅ JWT token-based authentication
- ✅ Token expiration (24 hours)
- ✅ Automatic token validation
- ✅ Protected API endpoints
- ✅ CORS configuration
- ✅ OAuth 2.0 integration

---

## Troubleshooting

### Google OAuth Not Working
- Verify Client ID and Client Secret in `application.properties`
- Check redirect URI matches exactly: `http://localhost:8080/login/oauth2/code/google`
- Ensure Google+ API is enabled in Google Cloud Console

### Token Expired Error
- JWT tokens expire after 24 hours
- User will be automatically redirected to login
- Login again to get new token

### 401 Unauthorized Error
- Check if token is present in localStorage
- Verify token is being sent in Authorization header
- Check backend logs for token validation errors

### CORS Errors
- Verify CORS configuration in `SecurityConfig.java`
- Check frontend is running on `http://localhost:5173`
- Check backend is running on `http://localhost:8080`

---

## Next Steps

Consider adding:
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Remember me option
- [ ] Two-factor authentication
- [ ] Role-based access control (Admin, Teacher, Student)
- [ ] Social login with Facebook, GitHub, etc.

---

## Support

For issues or questions, please check:
- Backend logs: `Backend/logs/`
- Browser console for frontend errors
- Network tab for API request/response details
