/* Key Features:

- **AuthLayout component**: Provides authentication context and error monitoring
- **Route nesting**: How child routes build upon parent paths
- **Protected vs. public routes**: Authentication requirements
- **Automatic redirects**: How / redirects to /c/new
- **Error handling**: RouteErrorBoundary for catching routing errors
*/

// Import React Router DOM functions for creating and managing routes
// - createBrowserRouter: Creates a router that uses the HTML5 history API (clean URLs without #)
// - Navigate: Component that programmatically redirects users to a different route
// - Outlet: Placeholder component where child routes will be rendered
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Import authentication-related components
// These handle user login, registration, password reset, and security features
import {
  Login,              // Login form component
  VerifyEmail,        // Email verification page
  Registration,       // User registration form
  ResetPassword,      // Password reset form
  ApiErrorWatcher,    // Component that monitors and handles API errors globally
  TwoFactorScreen,    // Two-factor authentication input screen
  RequestPasswordReset, // Form to request password reset email
} from '~/components/Auth';

// Import OAuth (third-party login) related components
// These handle success/error states when users log in with Google, GitHub, etc.
import { OAuthSuccess, OAuthError } from '~/components/OAuth';

// Import the authentication context provider
// This provides user authentication state (logged in/out) to all child components
import { AuthContextProvider } from '~/hooks/AuthContext';

// Import layout and route components
import RouteErrorBoundary from './RouteErrorBoundary';  // Catches and displays routing errors
import StartupLayout from './Layouts/Startup';          // Layout for initial app pages
import LoginLayout from './Layouts/Login';              // Layout specifically for login pages
import dashboardRoutes from './Dashboard';              // Pre-configured dashboard route structure
import ShareRoute from './ShareRoute';                  // Component for shared chat/conversation links
import ChatRoute from './ChatRoute';                    // Main chat interface component
import Search from './Search';                          // Search functionality component
import Root from './Root';                              // Root layout component

// AuthLayout Component
// This is a wrapper component that provides authentication context to all its children
// It renders:
// 1. AuthContextProvider - makes auth state available to child components
// 2. Outlet - where child routes will be displayed
// 3. ApiErrorWatcher - monitors for API errors throughout the app
const AuthLayout = () => (
  <AuthContextProvider>
    <Outlet />
    <ApiErrorWatcher />
  </AuthContextProvider>
);

// Main Router Configuration
// createBrowserRouter takes an array of route objects that define the app's URL structure
export const router = createBrowserRouter([

  // SHARED CONTENT ROUTE
  // URL pattern: /share/abc123 (where abc123 is a shareId parameter)
  // This allows users to access shared conversations via direct links
  {
    path: 'share/:shareId',           // :shareId is a URL parameter (dynamic)
    element: <ShareRoute />,          // Component that handles shared content display
    errorElement: <RouteErrorBoundary />, // What to show if this route has an error
  },

  // OAUTH AUTHENTICATION ROUTES
  // These handle third-party login redirects (Google, GitHub, etc.)
  {
    path: 'oauth',                    // Base path for OAuth routes
    errorElement: <RouteErrorBoundary />,
    children: [                       // Child routes inherit the parent path
      {
        path: 'success',              // Full URL: /oauth/success
        element: <OAuthSuccess />,    // Shows success message after OAuth login
      },
      {
        path: 'error',                // Full URL: /oauth/error  
        element: <OAuthError />,      // Shows error message if OAuth login fails
      },
    ],
  },

  // PUBLIC ROUTES (No authentication required)
  // These are wrapped in StartupLayout for consistent styling
  {
    path: '/',                        // Root path
    element: <StartupLayout />,       // Layout component for public pages
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'register',             // Full URL: /register
        element: <Registration />,    // User registration form
      },
      {
        path: 'forgot-password',      // Full URL: /forgot-password
        element: <RequestPasswordReset />, // Form to request password reset
      },
      {
        path: 'reset-password',       // Full URL: /reset-password
        element: <ResetPassword />,   // Form to set new password
      },
    ],
  },

  // EMAIL VERIFICATION ROUTE
  // Standalone route for email verification (usually accessed via email link)
  {
    path: 'verify',                   // Full URL: /verify
    element: <VerifyEmail />,         // Email verification component
    errorElement: <RouteErrorBoundary />,
  },

  // PROTECTED ROUTES (Authentication required)
  // All routes under this section require user authentication
  // They're wrapped in AuthLayout which provides auth context
  {
    element: <AuthLayout />,          // No path = this layout wraps child routes
    errorElement: <RouteErrorBoundary />,
    children: [

      // LOGIN ROUTES
      // These use LoginLayout for styling login-specific pages
      {
        path: '/',                    // Base path for login routes
        element: <LoginLayout />,     // Layout for login pages
        children: [
          {
            path: 'login',            // Full URL: /login
            element: <Login />,       // Standard login form
          },
          {
            path: 'login/2fa',        // Full URL: /login/2fa
            element: <TwoFactorScreen />, // Two-factor authentication input
          },
        ],
      },

      // DASHBOARD ROUTES
      // Pre-configured routes imported from './Dashboard'
      // This likely includes admin panels, user settings, etc.
      dashboardRoutes,                // Spreads dashboard route configuration here

      // MAIN APPLICATION ROUTES
      // Core chat and search functionality
      {
        path: '/',                    // Root path for main app
        element: <Root />,            // Main app layout
        children: [
          {
            index: true,              // This route matches exactly "/"
            // Automatically redirect users from "/" to "/c/new" 
            // (starts a new conversation)
            element: <Navigate to="/c/new" replace={true} />,
          },
          {
            // Chat route with optional conversation ID
            // "/c/new" = new conversation
            // "/c/abc123" = existing conversation with ID abc123
            path: 'c/:conversationId?', // ? makes conversationId optional
            element: <ChatRoute />,     // Main chat interface
          },
          {
            path: 'search',           // Full URL: /search
            element: <Search />,      // Search functionality
          },
        ],
      },
    ],
  },
]);

/*
ROUTE HIERARCHY EXPLANATION:

Public Routes (no auth needed):
- /register
- /forgot-password  
- /reset-password
- /verify
- /share/:shareId
- /oauth/success
- /oauth/error

Protected Routes (auth required):
- /login
- /login/2fa
- /dashboard/* (whatever dashboardRoutes defines)
- / (redirects to /c/new)
- /c/:conversationId? (main chat)
- /search

URL PARAMETER EXPLANATION:
- :shareId = required parameter (must have a value)
- :conversationId? = optional parameter (? makes it optional)

LAYOUT NESTING:
- StartupLayout wraps public registration/password routes
- LoginLayout wraps login-specific routes  
- AuthLayout wraps all protected routes and provides auth context
- Root wraps the main chat application routes
*/