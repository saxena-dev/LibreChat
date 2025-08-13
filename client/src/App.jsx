import { RecoilRoot } from 'recoil';                    // State management library for React
import { DndProvider } from 'react-dnd';                // Drag and drop functionality provider
import { RouterProvider } from 'react-router-dom';      // React routing system for navigation
import * as RadixToast from '@radix-ui/react-toast';    // Toast notification system from Radix UI
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5 backend for drag and drop
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Development tools for React Query
import { Toast, ThemeProvider, ToastProvider } from '@librechat/client'; // Custom components from LibreChat
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'; // Data fetching and caching library
import { ScreenshotProvider, useApiErrorBoundary } from './hooks'; // Custom React hooks
import { getThemeFromEnv } from './utils/getThemeFromEnv'; // Utility function to get theme from environment
import { LiveAnnouncer } from '~/a11y';                  // Accessibility component for screen readers
import { router } from './routes';                       // Application routing configuration

/**
 * Main App component that sets up all the providers and global configuration
 * This component wraps the entire application with necessary context providers
 */
const App = () => {
  // Extract the setError function from a custom hook that handles API error boundaries
  // This hook likely provides error handling functionality for API calls
  const { setError } = useApiErrorBoundary();

  // Create a new QueryClient instance for managing server state and caching
  // QueryClient is the core of React Query that handles data fetching, caching, and synchronization
  const queryClient = new QueryClient({
    // QueryCache configuration - handles how queries are cached and errors are managed
    queryCache: new QueryCache({
      // Global error handler for all queries managed by React Query
      onError: (error) => {
        // Check if the error is an HTTP 401 (Unauthorized) status
        // The ?. operator is optional chaining - it safely accesses nested properties
        // without throwing an error if any part of the chain is null/undefined
        if (error?.response?.status === 401) {
          // If it's a 401 error (user not authenticated), trigger the error boundary
          setError(error);
        }
      },
    }),
  });

  // Get theme configuration from environment variables
  // This allows the app theme to be configured via environment variables
  const envTheme = getThemeFromEnv();

  return (
    // QueryClientProvider: Makes React Query available throughout the app
    // All components inside can now use React Query hooks like useQuery, useMutation, etc.
    <QueryClientProvider client={queryClient}>

      {/* RecoilRoot: Provides Recoil state management context to the entire app
          Recoil is Facebook's experimental state management library for React
          All components inside can now use Recoil hooks like useRecoilState, useRecoilValue */}
      <RecoilRoot>

        {/* LiveAnnouncer: Accessibility component that announces dynamic content changes
            to screen readers, helping visually impaired users understand app updates */}
        <LiveAnnouncer>

          {/* ThemeProvider: Manages application theming (dark/light mode, custom colors)
              The spread operator {...} conditionally adds props only if envTheme exists */}
          <ThemeProvider
            // Only pass initialTheme and themeRGB if environment theme exists
            // This allows localStorage values to persist when no env theme is set
            {...(envTheme && { initialTheme: 'system', themeRGB: envTheme })}
          >
            {/* The ThemeProvider will automatically:
                1. Apply dark/light mode classes to components
                2. Apply custom theme colors if envTheme is provided from environment
                3. Otherwise use stored theme preferences from localStorage
                4. Fall back to default theme colors if nothing is stored */}

            {/* RadixToast.Provider: Sets up the context for toast notifications
                Radix UI is a low-level UI component library that provides accessible components */}
            <RadixToast.Provider>

              {/* ToastProvider: Custom wrapper around Radix Toast, likely adds LibreChat-specific
                  styling and behavior to the toast notification system */}
              <ToastProvider>

                {/* DndProvider: Enables drag and drop functionality throughout the app
                    HTML5Backend means it uses the browser's native HTML5 drag and drop API */}
                <DndProvider backend={HTML5Backend}>

                  {/* RouterProvider: Renders the application routes and handles navigation
                      The 'router' object contains all the route definitions for the app */}
                  <RouterProvider router={router} />

                  {/* ReactQueryDevtools: Development tool that shows React Query state
                      Only visible in development mode, helps debug data fetching
                      initialIsOpen={false} means it starts closed
                      position="top-right" places it in the top-right corner */}
                  <ReactQueryDevtools initialIsOpen={false} position="top-right" />

                  {/* Toast: Component that renders actual toast notifications */}
                  <Toast />

                  {/* RadixToast.Viewport: Container where toast notifications appear
                      The className contains Tailwind CSS utility classes for styling:
                      - pointer-events-none: Toasts don't block clicks to content behind them
                      - fixed inset-0: Positioned fixed, covering the entire screen
                      - z-[1000]: High z-index so toasts appear above everything else
                      - mx-auto my-2: Centered horizontally with vertical margin
                      - flex max-w-[560px] flex-col: Flexbox column layout with max width
                      - items-stretch justify-start: Flex alignment properties
                      - md:pb-5: Padding bottom on medium screens and up */}
                  <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />

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
 * Default export: The actual component that gets rendered when App.jsx is imported
 * This is wrapped with additional providers that need to be at the very top level
 */
export default () => (
  // ScreenshotProvider: Likely provides functionality for taking screenshots within the app
  // This is wrapped at the highest level, outside of all other providers
  <ScreenshotProvider>

    {/* The main App component with all its nested providers */}
    <App />

    {/* Hidden iframe that plays silent audio
        This is a common workaround for web apps that need to play audio
        Many browsers block autoplay of audio unless user has interacted with the page
        By having a silent audio file ready, the app can later play sounds without restrictions
        
        Attributes explained:
        - src="/assets/silence.mp3": Points to a silent MP3 file
        - allow="autoplay": Gives permission for autoplay
        - id="audio": Identifier for JavaScript to reference this element
        - title="audio-silence": Accessibility title
        - style={{ display: 'none' }}: Completely hidden from view */}
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
OVERALL ARCHITECTURE EXPLANATION:

This App.jsx file sets up the foundational structure for the LibreChat application.
It follows the React pattern of "provider wrapping" where different context providers
are nested to make their functionality available to all child components.

The providers are arranged in a specific order:
1. ScreenshotProvider (outermost) - Screenshot functionality
2. QueryClientProvider - Data fetching and caching
3. RecoilRoot - State management
4. LiveAnnouncer - Accessibility announcements
5. ThemeProvider - Theme and styling
6. RadixToast.Provider - Toast notification system
7. ToastProvider - Custom toast wrapper
8. DndProvider - Drag and drop functionality
9. RouterProvider - Routing and navigation (innermost)

Each provider makes certain React hooks and functionality available to components
rendered inside it. This pattern allows for clean separation of concerns and
makes the app's global state and functionality easily accessible throughout
the component tree.

The silent iframe at the bottom is a web audio workaround that ensures the app
can play sounds later without being blocked by browser autoplay policies.
*/