{/* 
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
*/}

// Import React core functionality
import React, { useState, useEffect } from 'react';
// Import Outlet from react-router-dom - this is where child route components will be rendered
import { Outlet } from 'react-router-dom';

// Import TypeScript type definitions
import type { ContextType } from '~/common';

// Import custom React hooks for managing application state
import {
  useAuthContext,     // Hook for authentication state and methods
  useAssistantsMap,   // Hook for managing AI assistants data
  useAgentsMap,       // Hook for managing AI agents data
  useFileMap,         // Hook for managing file uploads/attachments
  useSearchEnabled,   // Hook for search functionality state
} from '~/hooks';

// Import React Context providers for sharing state across the component tree
import {
  AgentsMapContext,      // Context for sharing agents data
  AssistantsMapContext,  // Context for sharing assistants data
  FileMapContext,        // Context for sharing file data
  SetConvoProvider,      // Context for managing conversation state
} from '~/Providers';

// Import custom hooks for API data fetching
import { useUserTermsQuery, useGetStartupConfig } from '~/data-provider';

// Import UI components
import { TermsAndConditionsModal } from '~/components/ui';
import { Nav, MobileNav } from '~/components/Nav';
import { useHealthCheck } from '~/data-provider';
import { Banner } from '~/components/Banners';

// Main Root component - this is the top-level layout component for the authenticated app
export default function Root() {

  // ===== LOCAL STATE MANAGEMENT =====

  // State to control whether the Terms and Conditions modal is shown
  const [showTerms, setShowTerms] = useState(false);

  // State to track the height of the banner component (for layout calculations)
  const [bannerHeight, setBannerHeight] = useState(0);

  // State to control navigation sidebar visibility
  // This uses lazy initialization - the function only runs once when component mounts
  const [navVisible, setNavVisible] = useState(() => {
    // Try to get saved navigation visibility preference from browser's localStorage
    const savedNavVisible = localStorage.getItem('navVisible');
    // If a preference exists, parse it from JSON string to boolean
    // If no preference exists, default to true (navigation visible)
    return savedNavVisible !== null ? JSON.parse(savedNavVisible) : true;
  });

  // ===== AUTHENTICATION =====

  // Get authentication state and logout function from the auth context
  const { isAuthenticated, logout } = useAuthContext();

  // ===== HEALTH CHECK =====

  // Run a health check on the backend API once per authenticated session
  // This ensures the connection to the server is working properly
  useHealthCheck(isAuthenticated);

  // ===== DATA FETCHING HOOKS =====

  // Fetch and manage assistants data (AI models like GPT, Claude, etc.)
  // Only runs when user is authenticated
  const assistantsMap = useAssistantsMap({ isAuthenticated });

  // Fetch and manage agents data (custom AI agents with specific behaviors)
  // Only runs when user is authenticated
  const agentsMap = useAgentsMap({ isAuthenticated });

  // Fetch and manage file attachments data
  // Only runs when user is authenticated
  const fileMap = useFileMap({ isAuthenticated });

  // Fetch application startup configuration from the server
  // This includes settings like UI preferences, enabled features, etc.
  const { data: config } = useGetStartupConfig();

  // Fetch user's terms of service acceptance status
  // Only enabled when:
  // 1. User is authenticated AND
  // 2. The config says terms modal acceptance is required
  const { data: termsData } = useUserTermsQuery({
    enabled: isAuthenticated && config?.interface?.termsOfService?.modalAcceptance === true,
  });

  // Enable search functionality when user is authenticated
  useSearchEnabled(isAuthenticated);

  // ===== SIDE EFFECTS =====

  // Watch for changes in terms data and update modal visibility
  useEffect(() => {
    if (termsData) {
      // Show terms modal if user hasn't accepted terms yet
      // termsAccepted is a boolean, so !termsAccepted means "not accepted"
      setShowTerms(!termsData.termsAccepted);
    }
  }, [termsData]); // This effect runs whenever termsData changes

  // ===== EVENT HANDLERS =====

  // Handle when user accepts the terms and conditions
  const handleAcceptTerms = () => {
    // Simply hide the modal - the actual acceptance is handled by the modal component
    setShowTerms(false);
  };

  // Handle when user declines the terms and conditions
  const handleDeclineTerms = () => {
    // Hide the modal
    setShowTerms(false);
    // Log the user out and redirect to login page with redirect=false parameter
    // This prevents automatic redirects after logout
    logout('/login?redirect=false');
  };

  // ===== EARLY RETURN =====

  // If user is not authenticated, don't render anything
  // This prevents the app layout from showing to unauthorized users
  if (!isAuthenticated) {
    return null;
  }

  // ===== MAIN RENDER =====

  return (
    // SetConvoProvider: Provides conversation state management to all child components
    <SetConvoProvider>
      {/* FileMapContext.Provider: Makes file data available to all child components */}
      <FileMapContext.Provider value={fileMap}>
        {/* AssistantsMapContext.Provider: Makes assistants data available to all child components */}
        <AssistantsMapContext.Provider value={assistantsMap}>
          {/* AgentsMapContext.Provider: Makes agents data available to all child components */}
          <AgentsMapContext.Provider value={agentsMap}>

            {/* Banner component - shows announcements, updates, etc. at the top */}
            {/* onHeightChange callback updates bannerHeight state when banner size changes */}
            <Banner onHeightChange={setBannerHeight} />

            {/* Main application container */}
            {/* Uses CSS flexbox for layout */}
            {/* Height calculation: 100dvh (full viewport height) minus banner height */}
            {/* dvh = dynamic viewport height (better than vh on mobile) */}
            <div className="flex" style={{ height: `calc(100dvh - ${bannerHeight}px)` }}>

              {/* Content wrapper with relative positioning and z-index for layering */}
              <div className="relative z-0 flex h-full w-full overflow-hidden">

                {/* Desktop navigation sidebar */}
                {/* navVisible and setNavVisible control whether it's shown/hidden */}
                <Nav navVisible={navVisible} setNavVisible={setNavVisible} />

                {/* Main content area */}
                {/* flex-1 means it takes up remaining space after nav */}
                {/* max-w-full prevents content from overflowing */}
                <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">

                  {/* Mobile navigation component (hamburger menu, etc.) */}
                  <MobileNav setNavVisible={setNavVisible} />

                  {/* Outlet is where child route components are rendered */}
                  {/* context prop passes data to child components */}
                  {/* satisfies ContextType ensures the context matches expected type */}
                  <Outlet context={{ navVisible, setNavVisible } satisfies ContextType} />

                </div>
              </div>
            </div>

          </AgentsMapContext.Provider>

          {/* Terms and Conditions Modal */}
          {/* Only rendered if the config requires modal acceptance */}
          {/* Uses optional chaining (?.) to safely access nested properties */}
          {config?.interface?.termsOfService?.modalAcceptance === true && (
            <TermsAndConditionsModal
              open={showTerms}                    // Controls if modal is visible
              onOpenChange={setShowTerms}         // Callback when modal open state changes
              onAccept={handleAcceptTerms}        // Callback when user accepts terms
              onDecline={handleDeclineTerms}      // Callback when user declines terms
              title={config.interface.termsOfService.modalTitle}        // Modal title from config
              modalContent={config.interface.termsOfService.modalContent} // Modal content from config
            />
          )}

        </AssistantsMapContext.Provider>
      </FileMapContext.Provider>
    </SetConvoProvider>
  );
}