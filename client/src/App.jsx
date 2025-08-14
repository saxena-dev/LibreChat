// client/src/App.jsx

// Import statements: Bringing in external libraries and local components
import { RecoilRoot } from 'recoil';                    // State management library for React - alternative to Redux
import { DndProvider } from 'react-dnd';                // Drag and drop functionality provider for interactive UIs
import { RouterProvider } from 'react-router-dom';      // React routing system for single-page app navigation
import * as RadixToast from '@radix-ui/react-toast';    // Toast notification system from Radix UI (accessible component library)
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5 backend for drag and drop - uses browser's native DnD API
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Development tools for inspecting React Query state
import { Toast, ThemeProvider, ToastProvider } from '@librechat/client'; // Custom LibreChat components for UI and theming
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'; // Data fetching and caching library (formerly React Query)
import { ScreenshotProvider, useApiErrorBoundary } from './hooks'; // Custom React hooks for app-specific functionality
import { getThemeFromEnv } from './utils/getThemeFromEnv'; // Utility function to extract theme configuration from environment variables
import { LiveAnnouncer } from '~/a11y';                  // Accessibility component for screen reader announcements
import { router } from './routes';                       // Application routing configuration defining all app pages/routes

/**
 * Main App component that establishes the provider hierarchy for LibreChat.
 * 
 * This component serves as the root of the application and sets up all necessary
 * context providers in the correct order. Each provider makes specific functionality
 * available to all components rendered within it.
 * 
 * Key responsibilities:
 * - Configure data fetching and caching (React Query)
 * - Set up global state management (Recoil)
 * - Enable theming and dark/light mode
 * - Provide drag-and-drop capabilities
 * - Handle global error boundaries for API calls
 * - Set up accessibility features
 * - Configure toast notifications
 */
const App = () => {
  // Extract error handling function from custom hook
  // useApiErrorBoundary provides centralized error handling for API calls throughout the app
  const { setError } = useApiErrorBoundary();

  // Create QueryClient instance for managing server state
  // QueryClient is the core of React Query that handles:
  // - Data fetching from APIs
  // - Caching responses to avoid unnecessary requests
  // - Background refetching to keep data fresh
  // - Optimistic updates and rollbacks
  const queryClient = new QueryClient({
    // QueryCache configuration controls how all queries are cached and managed
    queryCache: new QueryCache({
      // Global error handler for all React Query operations
      // This runs whenever any useQuery, useMutation, etc. encounters an error
      onError: (error) => {
        // TypeScript optional chaining (?.) safely navigates nested object properties
        // Without optional chaining: error.response.status would throw if error.response is null/undefined
        // With optional chaining: returns undefined instead of throwing, preventing app crashes
        if (error?.response?.status === 401) {
          // HTTP 401 = Unauthorized - user's authentication has expired or is invalid
          // Trigger the error boundary to handle this globally (likely redirects to login)
          setError(error);
        }
        // Other errors are handled by individual components that initiated the request
      },
    }),
  });

  // Extract theme configuration from environment variables
  // This allows deployment environments to override default themes
  // Returns undefined if no environment theme is configured
  const envTheme = getThemeFromEnv();

  return (
    // React Query Provider: Makes data fetching hooks available app-wide
    // Any component can now use useQuery, useMutation, useQueryClient, etc.
    <QueryClientProvider client={queryClient}>

      {/* Recoil State Management Root: Provides global state context
          Recoil is Facebook's experimental state management library
          Benefits over Redux:
          - Less boilerplate code required
          - Built-in async support
          - Automatic dependency tracking
          - Better TypeScript integration */}
      <RecoilRoot>

        {/* Accessibility Live Announcer: Improves screen reader experience
            Announces dynamic content changes to assistive technologies
            Critical for users who rely on screen readers to navigate the app */}
        <LiveAnnouncer>

          {/* Theme Provider: Manages application appearance and styling
              Handles dark/light mode switching and custom color schemes */}
          <ThemeProvider
            // Conditional prop spreading using spread operator (...)
            // Only adds initialTheme and themeRGB props if envTheme exists
            // This preserves user's localStorage theme preferences when no env override exists
            {...(envTheme && {
              initialTheme: 'system',  // Follow user's OS dark/light preference
              themeRGB: envTheme       // Apply custom theme colors from environment
            })}
          >
            {/* ThemeProvider behavior:
                - If envTheme exists: Use 'system' theme with custom colors from env
                - If no envTheme: Use stored preferences from localStorage
                - If no stored preferences: Use default theme configuration */}

            {/* Radix Toast Provider: Low-level toast notification system
                Radix UI provides unstyled, accessible components that follow WAI-ARIA standards
                This creates the context for toast notifications throughout the app */}
            <RadixToast.Provider>

              {/* Custom Toast Provider: LibreChat-specific toast wrapper
                  Likely adds custom styling, positioning, and behavior on top of Radix Toast */}
              <ToastProvider>

                {/* Drag and Drop Provider: Enables interactive drag-and-drop features
                    HTML5Backend uses browser's native drag-and-drop API for better performance
                    Alternative backends exist for touch devices or custom behavior */}
                <DndProvider backend={HTML5Backend}>

                  {/* Router Provider: Handles single-page application routing
                      Renders different components based on current URL
                      The 'router' object defines all available routes and their components */}
                  <RouterProvider router={router} />

                  {/* Development Tools: React Query state inspector (only in development)
                      Provides visual interface to:
                      - See all active queries and their states
                      - Inspect cached data
                      - Manually trigger refetches
                      - View query timelines and performance
                      
                      Configuration:
                      - initialIsOpen={false}: Starts collapsed to avoid cluttering development UI
                      - position="top-right": Places devtools in top-right corner */}
                  <ReactQueryDevtools initialIsOpen={false} position="top-right" />

                  {/* Toast Notification Component: Renders actual toast messages
                      This component displays the toast notifications created by other parts of the app */}
                  <Toast />

                  {/* Toast Viewport: Container that defines where toasts appear on screen
                      Radix requires a viewport to control toast positioning and stacking */}
                  <RadixToast.Viewport
                    className={
                      // Tailwind CSS utility classes for styling:
                      "pointer-events-none " +     // Toasts don't block clicks to content behind them
                      "fixed inset-0 " +            // Fixed positioning covering full screen (top: 0, right: 0, bottom: 0, left: 0)
                      "z-[1000] " +                 // High z-index (CSS stacking context) - toasts appear above all other content
                      "mx-auto my-2 " +             // Margin: auto horizontal (centers), 0.5rem vertical
                      "flex max-w-[560px] " +       // Flexbox layout with maximum width of 560px
                      "flex-col " +                 // Flex direction column (toasts stack vertically)
                      "items-stretch " +            // Flex items stretch to full width
                      "justify-start " +            // Align items to start of container (top)
                      "md:pb-5"                     // Padding-bottom: 1.25rem on medium screens (768px+) and up
                    }
                  />

                </DndProvider>
              </ToastProvider>
            </RadixToast.Provider>
          </ThemeProvider>
        </LiveAnnouncer>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

/**
 * Default Export Component: The actual root component with additional top-level providers.
 * 
 * This wrapper pattern allows certain providers to be at the very top level,
 * outside of even the main App component. This is useful for providers that
 * need to wrap everything, including potential error boundaries.
 */
export default () => (
  // Screenshot Provider: Enables screenshot functionality throughout the app
  // Placed at the highest level to capture the entire application state
  // Likely provides hooks like useScreenshot() to other components
  <ScreenshotProvider>

    {/* The main App component with all its nested providers */}
    <App />

    {/* Silent Audio Iframe: Web browser autoplay policy workaround
        
        Problem: Modern browsers block audio autoplay unless user has interacted with the page
        Solution: Preload a silent audio file that the browser allows
        
        This technique "primes" the browser's audio system so that when the app later
        needs to play notification sounds or audio messages, it won't be blocked.
        
        How it works:
        1. Browser loads and "plays" silent audio automatically
        2. This establishes an audio context and user gesture
        3. Future audio plays without restrictions
        
        Attributes explained:
        - src="/assets/silence.mp3": Path to silent MP3 file (must exist in public/assets/)
        - allow="autoplay": Explicitly grants autoplay permission to this iframe
        - id="audio": Unique identifier for JavaScript code to reference this element
        - title="audio-silence": Accessibility label for screen readers
        - style={{ display: 'none' }}: CSS to completely hide iframe from view
        
        Note: This iframe is completely invisible and doesn't affect the user experience */}
    <iframe
      src="/assets/silence.mp3"
      allow="autoplay"
      id="audio"
      title="audio-silence"
      style={{
        display: 'none',
      }}
    />
  </ScreenshotProvider>
);

/*
=== OVERALL ARCHITECTURE EXPLANATION ===

This App.jsx file implements the "Provider Pattern" - a React design pattern where
context providers are nested to make their functionality available to child components.

PROVIDER HIERARCHY (outside to inside):
1. ScreenshotProvider     - Screenshot functionality
2. QueryClientProvider   - Data fetching, caching, server state
3. RecoilRoot            - Client state management
4. LiveAnnouncer         - Accessibility announcements  
5. ThemeProvider         - Theming, dark/light mode
6. RadixToast.Provider   - Toast notification system
7. ToastProvider         - Custom toast styling/behavior
8. DndProvider           - Drag and drop interactions
9. RouterProvider        - URL routing, page navigation

WHY THIS ORDER MATTERS:
- Outer providers need to wrap inner ones they depend on
- Error boundaries should be outside the components they protect
- State management should be available to routing components
- UI providers (theme, toast) should be available to all pages

REACT HOOKS AVAILABILITY:
Each provider makes specific hooks available to components inside it:
- useQuery, useMutation (from QueryClientProvider)
- useRecoilState, useRecoilValue (from RecoilRoot)
- useTheme (from ThemeProvider)  
- useDrag, useDrop (from DndProvider)
- useNavigate, useLocation (from RouterProvider)

TYPESCRIPT BENEFITS IN THIS FILE:
- Import statements provide type safety for all imported components
- Optional chaining (?.) prevents runtime errors from undefined properties
- Spread operator with conditional logic provides type-safe prop passing
- React.FC type inference ensures component returns valid JSX

This architecture provides a solid foundation for a complex chat application
with features like real-time updates, theming, drag-and-drop file uploads,
screenshot sharing, and comprehensive error handling.
*/