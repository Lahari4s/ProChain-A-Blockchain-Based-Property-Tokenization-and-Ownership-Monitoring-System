# ProChain Login Flow

## Updated Flow Structure

The application now uses a **login-first** approach where users must authenticate before accessing any features.

## User Journey

### 1. Landing Page (Login Selection)
**Route**: `/`

When users first visit ProChain, they see a beautiful login selection page with two options:

- **Admin Portal** (Purple-themed)
  - Full system access
  - Property management
  - Real-time monitoring
  - System analytics

- **Buyer Portal** (Blue-themed)
  - Property browsing
  - Purchase capabilities
  - Portfolio management
  - Property transfers

### 2. Authentication
Users select their role and proceed to the appropriate login page:

#### Admin Login (`/admin-login`)
- Credentials: `admin@prochain.com` / `admin123`
- Redirects to: `/dashboard`

#### Buyer Login (`/buyer-login`)
- Credentials: `buyer@prochain.com` / `buyer123`
- Redirects to: `/properties`

### 3. Post-Login Access

Once authenticated, users can access:

#### All Authenticated Users
- `/home` - Main home page with hero section
- Navigation between allowed pages via Navbar

#### Admin-Only Pages
- `/dashboard` - Admin dashboard
- `/register` - Property registration
- `/monitoring` - Real-time monitoring

#### Both Admin & Buyer Pages
- `/properties` - Property listings
- `/property/:tokenId` - Property details
- `/transfer/:tokenId` - Property transfers

### 4. Session Management
- Sessions persist in localStorage
- Automatic restoration on page refresh
- Logout redirects to login selection (`/`)

## Navigation Flow

```
┌─────────────────────────────────────┐
│   Landing Page (Login Selection)    │
│           Route: /                   │
└──────────┬──────────────┬───────────┘
           │              │
    ┌──────▼─────┐  ┌────▼──────┐
    │Admin Login │  │Buyer Login│
    │/admin-login│  │/buyer-login│
    └──────┬─────┘  └────┬──────┘
           │              │
    ┌──────▼─────┐  ┌────▼──────┐
    │ Dashboard  │  │Properties │
    │/dashboard  │  │/properties│
    └──────┬─────┘  └────┬──────┘
           │              │
           └──────┬───────┘
                  │
         ┌────────▼──────────┐
         │  Authenticated    │
         │   Home (/home)    │
         │  Other Protected  │
         │      Routes       │
         └───────────────────┘
```

## Route Protection Summary

| Route | Access Level | Redirect If Unauthorized |
|-------|-------------|--------------------------|
| `/` | Public | N/A |
| `/admin-login` | Public | N/A |
| `/buyer-login` | Public | N/A |
| `/home` | Authenticated (Any) | `/` |
| `/dashboard` | Admin Only | `/unauthorized` |
| `/register` | Admin Only | `/unauthorized` |
| `/monitoring` | Admin Only | `/unauthorized` |
| `/properties` | Authenticated (Any) | `/` |
| `/property/:id` | Authenticated (Any) | `/` |
| `/transfer/:id` | Authenticated (Any) | `/` |

## Key Features

### 1. Login Selection Page
- **Beautiful gradient background** with animated elements
- **Side-by-side cards** for Admin and Buyer
- **Feature highlights** for each role
- **Clear visual distinction** (Purple for Admin, Blue for Buyer)
- **Status indicator** showing blockchain security

### 2. Role-Based Experience
- **Admins** see management and monitoring features
- **Buyers** see property browsing and purchase features
- **Navbar adapts** based on user role
- **Dynamic CTAs** in hero section

### 3. Security
- Routes protected by authentication middleware
- Role-based access control
- Unauthorized access handled gracefully
- Session persistence with localStorage

### 4. User Experience
- Clean, intuitive navigation
- Consistent visual language
- Responsive design for mobile/desktop
- Smooth transitions and animations

## Implementation Details

### New Components
- `LoginSelection.tsx` - Landing page with login options
- Updated `App.tsx` - New routing structure
- Updated `Navbar.tsx` - Conditional home link
- Updated `ProtectedRoute.tsx` - Redirect to login selection

### Modified Routes
- `/` - Now shows login selection (was home page)
- `/home` - Protected home page (requires authentication)
- All other routes - Protected with role-based access

### Logout Behavior
- Clicking logout returns user to `/` (login selection)
- Session cleared from localStorage
- User must re-authenticate to access any protected routes

## Testing

1. **Visit** `http://localhost:8080`
2. **Choose** Admin or Buyer portal
3. **Login** with demo credentials
4. **Verify** appropriate access based on role
5. **Test** logout returns to login selection
6. **Test** direct URL access to protected routes redirects properly

## Demo Credentials

### Admin
```
Email: admin@prochain.com
Password: admin123
```

### Buyer
```
Email: buyer@prochain.com
Password: buyer123
```

## Next Steps for Production

1. **Backend Integration**
   - Connect to actual authentication API
   - Implement JWT tokens
   - Add refresh token mechanism

2. **Enhanced Security**
   - HTTPS enforcement
   - CSRF protection
   - Rate limiting
   - Password complexity requirements

3. **User Registration**
   - Buyer signup flow
   - Email verification
   - KYC integration

4. **Additional Features**
   - Password reset
   - Remember me functionality
   - Multi-factor authentication
   - Social login options
