# ProChain Authentication Guide

## Overview

ProChain now includes a comprehensive authentication system with separate login pages for administrators and buyers. The authentication system uses role-based access control to protect routes and features.

## User Roles

### Admin
- **Access**: Full system access
- **Capabilities**:
  - Dashboard management
  - Property registration
  - Real-time monitoring
  - Property transfers
  - View all properties

### Buyer
- **Access**: Limited to property browsing and purchases
- **Capabilities**:
  - Browse properties
  - View property details
  - Property transfers
  - Personal wallet management

## Demo Credentials

### Admin Login
- **URL**: `/admin-login`
- **Email**: `admin@prochain.com`
- **Password**: `admin123`

### Buyer Login
- **URL**: `/buyer-login`
- **Email**: `buyer@prochain.com`
- **Password**: `buyer123`

## Features

### 1. Authentication Context (`AuthContext`)
- Manages user authentication state
- Persists login sessions using localStorage
- Provides role-based access helpers
- Handles login and logout functionality

### 2. Protected Routes
- Routes are automatically protected based on user roles
- Unauthorized access redirects to appropriate login page
- Role-based access control prevents privilege escalation

### 3. Login Pages

#### Admin Login Page
- Purple-themed interface matching admin aesthetics
- Direct access to dashboard upon successful login
- Link to buyer login for role switching

#### Buyer Login Page
- Blue-themed interface for buyer experience
- Direct access to properties page upon successful login
- Link to admin login for role switching
- Option for signup (future implementation)

### 4. User Interface Integration

#### Navbar
- Shows login buttons when not authenticated
- Displays user dropdown menu when authenticated
- Includes user name, role, and logout option
- Responsive mobile menu with authentication state

#### Hero Section
- Dynamic CTA buttons based on authentication status
- Role-specific redirects (Dashboard for admin, Properties for buyer)
- Clear call-to-action for login

## Protected Routes

### Admin-Only Routes
- `/dashboard` - Admin dashboard
- `/register` - Property registration
- `/monitoring` - Real-time monitoring

### Accessible by Both Admin and Buyer
- `/properties` - Property listing
- `/property/:tokenId` - Property details
- `/transfer/:tokenId` - Property transfer

### Public Routes
- `/` - Home page
- `/admin-login` - Admin login
- `/buyer-login` - Buyer login
- `/unauthorized` - Access denied page

## Implementation Details

### Authentication Flow

1. **Login Process**:
   ```
   User enters credentials → AuthContext validates → User data stored in localStorage → Redirect to appropriate page
   ```

2. **Session Persistence**:
   - User data is stored in localStorage
   - Auto-restore session on page refresh
   - Secure logout clears all stored data

3. **Route Protection**:
   ```
   User navigates to protected route → ProtectedRoute checks authentication → Validates user role → Grants/denies access
   ```

### Future Enhancements

1. **Backend Integration**:
   - Replace demo credentials with actual API authentication
   - Implement JWT token-based authentication
   - Add refresh token mechanism

2. **Additional Features**:
   - Password reset functionality
   - Email verification
   - Two-factor authentication (2FA)
   - User registration for buyers
   - Admin user management

3. **Security Improvements**:
   - Implement secure password hashing
   - Add rate limiting for login attempts
   - Session timeout and auto-logout
   - Audit logging for authentication events

## Usage

### For Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the home page and click either:
   - "Admin Login" for administrative access
   - "Buyer Login" for buyer access

3. Use the demo credentials provided above

### For Production

⚠️ **Important**: Before deploying to production:

1. Replace demo credentials with proper backend authentication
2. Implement secure password storage (bcrypt, argon2)
3. Add HTTPS/TLS for secure transmission
4. Implement CSRF protection
5. Add rate limiting and brute force protection
6. Set up proper session management
7. Implement password policies

## Security Considerations

- Current implementation uses demo credentials for testing
- LocalStorage is used for session persistence (consider more secure alternatives for production)
- Always use HTTPS in production
- Implement proper CORS policies
- Never expose sensitive credentials in frontend code
- Use environment variables for configuration

## Troubleshooting

### Cannot Access Protected Routes
- Ensure you're logged in with the correct role
- Check browser console for errors
- Clear localStorage and try logging in again

### Session Not Persisting
- Check if localStorage is enabled in your browser
- Verify no browser extensions are blocking localStorage
- Try in incognito/private mode

### Login Credentials Not Working
- Verify you're using the correct credentials
- Check for typos in email/password
- Ensure you're on the correct login page (admin vs buyer)

## API Reference

### AuthContext Methods

```typescript
const { user, login, logout, isAuthenticated, isAdmin, isBuyer } = useAuth();

// Login
await login(email: string, password: string, role: 'admin' | 'buyer'): Promise<boolean>

// Logout
logout(): void

// Check authentication status
isAuthenticated: boolean
isAdmin: boolean
isBuyer: boolean
```

## Contact

For questions or issues with authentication, please refer to the main README or open an issue in the project repository.
