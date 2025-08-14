// client/src/routes/Root.tsx

/*
**Main Purpose**: This is the root layout component for LibreChat's authenticated 
application area. It sets up the overall structure, manages global state, and handles 
authentication-related UI.

**Key Concepts**:

1. **React Hooks**: Custom functions that manage state and side effects (like 
  `useState`, `useEffect`)

2. **Context Providers**: A React pattern for sharing data across many components 
without passing props down manually

3. **Conditional Rendering**: Components only show when certain conditions are met 
(like authentication status)

4. **TypeScript Features**: Type definitions ensure data has the expected structure, 
with optional chaining (`?.`) for safe property access

5. **Layout Strategy**: Uses CSS Flexbox and dynamic viewport height calculations to 
create a responsive layout

The component essentially creates a wrapper that:
- Checks if the user is authenticated
- Sets up global data contexts (files, assistants, agents)
- Renders the navigation and main content area
- Handles terms of service acceptance
- Provides a responsive layout structure
*/

// Import React core functionality for component creation and state management
import React, { useState, useEffect } from 'react';

// Import Outlet from react-router-dom - this is where child route components will be rendered
// Outlet acts as a placeholder that gets replaced with the component for the current route
import { Outlet } from 'react-router-dom';

// Import TypeScript type definitions
// ContextType defines the shape of data passed to child components via React Router
import type { ContextType } from '~/common';

// Import custom React hooks for managing application state
// These hooks encapsulate complex state logic and data fetching
import {
  useAuthContext,     // Hook for authentication state and methods (login/logout/user info)
  useAssistantsMap,   // Hook for managing AI assistants data (GPT-4, Claude, etc.)
  useAgentsMap,       // Hook for managing AI agents data (custom bot configurations)
  useFileMap,         // Hook for managing file uploads/attachments in conversations
  useSearchEnabled,   // Hook for search functionality state across the app
} from '~/hooks';

// Import React Context providers for sharing state across the component tree
// Context allows passing data through component tree without prop drilling
import {
  AgentsMapContext,      // Context for sharing agents data globally
  AssistantsMapContext,  // Context for sharing assistants data globally
  FileMapContext,        // Context for sharing file data globally
  SetConvoProvider,      // Context for managing conversation state and actions
} from '~/Providers';

// Import custom hooks for API data fetching
// These use React Query for caching, background updates, and error handling
import { useUserTermsQuery, useGetStartupConfig } from '~/data-provider';

// Import UI components for the layout and functionality
import { TermsAndConditionsModal } from '~/components/ui';
import { Nav, MobileNav } from '~/components/Nav';
import { useHealthCheck } from '~/data-provider';
import { Banner } from '~/components/Banners';

/**
 * Root Component - The main layout wrapper for LibreChat's authenticated application.
 * 
 * This component serves as the foundation for the entire authenticated user experience.
 * It handles:
 * - User authentication verification
 * - Global state management through React Context
 * - Terms of service modal display and handling
 * - Responsive layout structure (desktop nav, mobile nav, content area)
 * - Health checks to ensure backend connectivity
 * 
 * Component Structure:
 * - Context Providers (wrap everything to share data)
 * - Banner (announcements/notifications at top)
 * - Navigation (desktop sidebar + mobile hamburger menu)
 * - Main Content Area (where route components render)
 * - Terms Modal (when required by configuration)
 * 
 * @returns {JSX.Element | null} The root layout or null if user not authenticated
 */
export default function Root() {

  // ===== LOCAL STATE MANAGEMENT =====

  /**
   * Controls the visibility of the Terms and Conditions modal.
   * 
   * TypeScript Note: useState<boolean> explicitly types the state as boolean.
   * The hook returns [currentValue, setterFunction] as a tuple type.
   */
  const [showTerms, setShowTerms] = useState<boolean>(false);

  /**
   * Tracks the height of the banner component in pixels.
   * This is used for accurate layout calculations - the main content area
   * height is calculated as viewport height minus banner height.
   * 
   * TypeScript Note: useState<number> ensures only numeric values can be set.
   */
  const [bannerHeight, setBannerHeight] = useState<number>(0);

  /**
   * Controls navigation sidebar visibility with persistent user preference.
   * 
   * React Hook Pattern: Uses lazy initialization - the function parameter
   * only runs once when the component mounts, not on every re-render.
   * This is more efficient than running localStorage.getItem on every render.
   * 
   * TypeScript Note: The return type is inferred as boolean from the function.
   */
  const [navVisible, setNavVisible] = useState<boolean>(() => {
    // Try to get saved navigation visibility preference from browser's localStorage
    // localStorage stores data as strings, so we need to parse JSON
    const savedNavVisible = localStorage.getItem('navVisible');

    // TypeScript Pattern: null check with ternary operator
    // If a preference exists, parse it from JSON string to boolean
    // If no preference exists (null), default to true (navigation visible)
    return savedNavVisible !== null ? JSON.parse(savedNavVisible) : true;
  });

  // ===== AUTHENTICATION =====

  /**
   * Get authentication state and methods from the auth context.
   * 
   * React Context Pattern: useAuthContext() is a custom hook that calls
   * useContext(AuthContext) internally and provides authentication functionality.
   * 
   * TypeScript Pattern: Object destructuring with type inference.
   * The hook returns an object with these properties typed appropriately.
   */
  const { isAuthenticated, logout } = useAuthContext();

  // ===== HEALTH CHECK =====

  /**
   * Run a health check on the backend API once per authenticated session.
   * This ensures the connection to the server is working properly and
   * can help detect API issues early.
   * 
   * Custom Hook Pattern: useHealthCheck encapsulates the logic for
   * making periodic health check requests to the backend.
   * 
   * @param {boolean} isAuthenticated - Only run health checks for authenticated users
   */
  useHealthCheck(isAuthenticated);

  // ===== DATA FETCHING HOOKS =====

  /**
   * Fetch and manage assistants data (AI models like GPT-4, Claude, etc.).
   * 
   * React Query Pattern: This custom hook uses React Query internally to:
   * - Cache the assistants data
   * - Automatically refetch when stale
   * - Handle loading and error states
   * - Only run when user is authenticated
   * 
   * TypeScript Pattern: The hook returns a typed object/map of assistant data.
   */
  const assistantsMap = useAssistantsMap({ isAuthenticated });

  /**
   * Fetch and manage agents data (custom AI agents with specific behaviors).
   * 
   * Business Logic: Agents are user-created or pre-configured AI personalities
   * with specific instructions, knowledge bases, or behavioral patterns.
   * Only runs when user is authenticated to respect privacy and permissions.
   */
  const agentsMap = useAgentsMap({ isAuthenticated });

  /**
   * Fetch and manage file attachments data for conversations.
   * 
   * Business Logic: This includes uploaded files, images, documents that
   * users have attached to their conversations with AI assistants.
   * File data includes metadata like name, size, type, upload status, etc.
   */
  const fileMap = useFileMap({ isAuthenticated });

  /**
   * Fetch application startup configuration from the server.
   * 
   * React Query Pattern: This hook fetches configuration that determines:
   * - UI preferences and themes
   * - Enabled/disabled features
   * - Terms of service settings
   * - API endpoints and limits
   * 
   * TypeScript Note: The 'data' property is aliased as 'config' for clearer naming.
   */
  const { data: config } = useGetStartupConfig();

  /**
   * Fetch user's terms of service acceptance status from the backend.
   * 
   * React Query Pattern: The 'enabled' option controls when the query runs.
   * This query only executes when BOTH conditions are true:
   * 1. User is authenticated (has permission to check terms status)
   * 2. The server config requires modal acceptance (feature is enabled)
   * 
   * TypeScript Optional Chaining: config?.interface?.termsOfService?.modalAcceptance
   * safely accesses nested properties without throwing errors if any level is undefined.
   */
  const { data: termsData } = useUserTermsQuery({
    enabled: isAuthenticated && config?.interface?.termsOfService?.modalAcceptance === true,
  });

  /**
   * Enable search functionality when user is authenticated.
   * 
   * Side Effect Hook: This doesn't return data but enables search features
   * across the application when the user has proper authentication.
   */
  useSearchEnabled(isAuthenticated);

  // ===== SIDE EFFECTS =====

  /**
   * Watch for changes in terms data and update modal visibility accordingly.
   * 
   * useEffect Pattern: This runs after every render where termsData changes.
   * The dependency array [termsData] ensures it only runs when that specific
   * value changes, not on every render.
   * 
   * Business Logic: Show the terms modal if the user hasn't accepted terms yet.
   */
  useEffect(() => {
    if (termsData) {
      // TypeScript Boolean Logic: !termsData.termsAccepted means "not accepted"
      // If termsAccepted is false, !false becomes true, showing the modal
      // If termsAccepted is true, !true becomes false, hiding the modal
      setShowTerms(!termsData.termsAccepted);
    }
  }, [termsData]); // Dependency array - effect runs when termsData changes

  // ===== EVENT HANDLERS =====

  /**
   * Handle when user accepts the terms and conditions.
   * 
   * Event Handler Pattern: This function is passed as a callback prop
   * to the TermsAndConditionsModal component and gets called when
   * the user clicks the accept button.
   * 
   * Business Logic: Simply hide the modal - the actual terms acceptance
   * is handled by the modal component itself (likely makes an API call).
   */
  const handleAcceptTerms = (): void => {
    setShowTerms(false);
  };

  /**
   * Handle when user declines the terms and conditions.
   * 
   * Business Logic: If user declines terms, they cannot use the application,
   * so we log them out and redirect to login page.
   * 
   * @param {string} '/login?redirect=false' - URL parameter prevents automatic
   * redirects after logout, avoiding infinite redirect loops
   */
  const handleDeclineTerms = (): void => {
    // Hide the modal first
    setShowTerms(false);
    // Log the user out and redirect to login page with redirect=false parameter
    // This prevents automatic redirects after logout
    logout('/login?redirect=false');
  };

  // ===== EARLY RETURN PATTERN =====

  /**
   * Guard clause: If user is not authenticated, don't render anything.
   * 
   * React Pattern: Early returns prevent unnecessary rendering and improve performance.
   * This ensures that unauthorized users never see any part of the authenticated UI,
   * even for a brief moment during loading.
   * 
   * TypeScript: Returning null is a valid JSX return type meaning "render nothing"
   */
  if (!isAuthenticated) {
    return null;
  }

  // ===== MAIN RENDER =====

  return (
    /*
     * React Context Provider Pattern: Multiple providers wrap the entire app
     * to make data available to all child components without prop drilling.
     * 
     * Provider Nesting Order: Outer providers wrap inner ones, creating layers
     * of shared data. Child components can access any provider's data through
     * corresponding useContext hooks.
     */

    /* SetConvoProvider: Provides conversation state management to all child components
       This includes current conversation, conversation history, message handling, etc. */
    <SetConvoProvider>

      {/* FileMapContext.Provider: Makes file data available to all child components
          Value prop passes the fileMap data down to any component that uses useContext(FileMapContext) */}
      <FileMapContext.Provider value={fileMap}>

        {/* AssistantsMapContext.Provider: Makes assistants data available to all child components
            This allows any component to access available AI models and their configurations */}
        <AssistantsMapContext.Provider value={assistantsMap}>

          {/* AgentsMapContext.Provider: Makes agents data available to all child components
              This provides access to custom AI agents and their behavioral configurations */}
          <AgentsMapContext.Provider value={agentsMap}>

            {/* Banner component - shows announcements, updates, system messages at the top
                
                React Callback Pattern: onHeightChange prop receives a callback function
                that gets called whenever the banner's height changes (due to content changes,
                responsive design, etc.). This allows the parent component to adjust layouts accordingly.
                
                TypeScript: setBannerHeight is passed as a callback and has type (height: number) => void */}
            <Banner onHeightChange={setBannerHeight} />

            {/* Main application container with dynamic height calculation
                
                CSS-in-JS Pattern: The style prop uses JavaScript to calculate CSS values.
                This is necessary because we need to subtract the banner height from the viewport height.
                
                CSS Units Explained:
                - 100dvh = 100% of dynamic viewport height (better than vh on mobile browsers)
                - dvh adjusts for mobile browser UI that can hide/show (like address bar)
                - The calc() function performs the mathematical subtraction
                
                Flexbox Layout: The 'flex' class establishes a flexbox container for layout control */}
            <div className="flex" style={{ height: `calc(100dvh - ${bannerHeight}px)` }}>

              {/* Content wrapper with positioning and layering
                  
                  CSS Classes Explained:
                  - relative: Establishes a positioning context for child elements
                  - z-0: Sets z-index to 0 for layering control
                  - flex: Makes this a flexbox container
                  - h-full: Height 100% of parent
                  - w-full: Width 100% of parent
                  - overflow-hidden: Prevents content from spilling outside boundaries */}
              <div className="relative z-0 flex h-full w-full overflow-hidden">

                {/* Desktop navigation sidebar
                    
                    Responsive Design Pattern: This navigation is hidden on mobile
                    and shown on desktop. The mobile version is handled separately below.
                    
                    Props Explained:
                    - navVisible: boolean controlling if nav is expanded/collapsed
                    - setNavVisible: function to toggle nav visibility */}
                <Nav navVisible={navVisible} setNavVisible={setNavVisible} />

                {/* Main content area that takes up remaining space
                    
                    Flexbox Pattern: flex-1 means "grow to fill available space"
                    after other flex items (like Nav) take their required space.
                    
                    CSS Classes Explained:
                    - relative: Positioning context for child elements
                    - flex: Establishes flexbox container
                    - h-full: Full height of parent container
                    - max-w-full: Prevents width from exceeding parent (overflow prevention)
                    - flex-1: Grow to fill remaining space
                    - flex-col: Arrange children vertically (column direction)
                    - overflow-hidden: Prevent content overflow */}
                <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">

                  {/* Mobile navigation component (hamburger menu, etc.)
                      
                      Responsive Design: This component handles navigation on mobile devices
                      where there isn't room for a permanent sidebar. Usually includes
                      a hamburger menu button and slide-out drawer.
                      
                      Props: setNavVisible allows the mobile nav to control desktop nav visibility */}
                  <MobileNav setNavVisible={setNavVisible} />

                  {/* React Router Outlet - where child route components are rendered
                      
                      React Router Pattern: Outlet acts as a placeholder that gets replaced
                      with the component for the current route (e.g., /chat, /settings, etc.)
                      
                      Context Prop: Passes data down to child route components without
                      requiring them to import and use React Context hooks.
                      
                      TypeScript Pattern: 'satisfies ContextType' is a type assertion
                      that ensures the context object matches the expected ContextType interface
                      without changing the actual type. This provides type safety while
                      maintaining the inferred type of the object. */}
                  <Outlet context={{ navVisible, setNavVisible } satisfies ContextType} />

                </div>
              </div>
            </div>

          </AgentsMapContext.Provider>

          {/* Terms and Conditions Modal - Conditionally rendered based on configuration
              
              Conditional Rendering Pattern: The && operator creates a conditional render.
              If the left side is truthy, the right side (the modal) renders.
              If the left side is falsy, nothing renders.
              
              TypeScript Optional Chaining Deep Dive: config?.interface?.termsOfService?.modalAcceptance
              - config? - if config is null/undefined, stop and return undefined
              - interface? - if config.interface is null/undefined, stop and return undefined  
              - termsOfService? - if interface.termsOfService is null/undefined, stop and return undefined
              - modalAcceptance - finally access the boolean property
              
              This prevents runtime errors that would occur with config.interface.termsOfService.modalAcceptance
              if any intermediate property was null/undefined. */}
          {config?.interface?.termsOfService?.modalAcceptance === true && (
            <TermsAndConditionsModal
              open={showTerms}                    // Controls if modal is visible (boolean)
              onOpenChange={setShowTerms}         // Callback when modal open state changes
              onAccept={handleAcceptTerms}        // Callback when user accepts terms
              onDecline={handleDeclineTerms}      // Callback when user declines terms
              title={config.interface.termsOfService.modalTitle}        // Modal title from server config
              modalContent={config.interface.termsOfService.modalContent} // Modal content from server config
            />
          )}

        </AssistantsMapContext.Provider>
      </FileMapContext.Provider>
    </SetConvoProvider>
  );
}