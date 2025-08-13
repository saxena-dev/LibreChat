/* 
**Main Purpose**: This file acts as the central hub for LibreChat's state management 
system, combining multiple specialized store modules into one unified store.

**Key Concepts**:

1. **Import/Export Pattern**: The file imports functionality from various modules and 
re-exports them as one combined object
2. **Spread Operator (`...`)**: Takes all properties from each module and combines 
them into the final store object
3. **Modular Architecture**: Instead of one massive store file, the app splits state 
management into logical pieces (user data, settings, search, etc.)

**How It's Used**: Other parts of the app can import this single store and access 
any functionality from any of the individual modules, making the code more organized 
and maintainable.
*/

// This file serves as the main entry point for the application's state management store
// It imports and re-exports all the different store modules to create a centralized store

// IMPORTS SECTION:
// Each import statement brings in a different part of the application's state management
// These are likely Zustand stores or similar state management modules

// Import all exports from the artifacts module (using * as syntax)
// The artifacts module probably handles AI-generated content like code, documents, etc.
import * as artifacts from './artifacts';

// Import the default export from each module
// Each of these represents a different slice of the application state:

// Handles different AI model families (like GPT, Claude, etc.)
import families from './families';

// Manages API endpoints and connection settings
import endpoints from './endpoints';

// Handles user authentication, profile, and user-specific data
import user from './user';

// Manages text content, possibly including internationalization strings
import text from './text';

// Controls toast notifications (those popup messages you see in apps)
import toast from './toast';

// Handles form submissions and their states (loading, success, error, etc.)
import submission from './submission';

// Manages search functionality and search results
import search from './search';

// Handles conversation presets (saved conversation templates/configurations)
import preset from './preset';

// Manages user-created prompts and prompt templates
import prompts from './prompts';

// Handles language/localization settings (probably for i18n - internationalization)
import lang from './language';

// Manages application settings and user preferences
import settings from './settings';

// Handles miscellaneous state that doesn't fit in other categories
import misc from './misc';

// Manages temporary state that should be cleared on refresh/reload
import isTemporary from './temporary';

// RE-EXPORT SECTION:
// This line re-exports everything from the agents module
// This allows other parts of the app to import agent-related functionality
// directly from this main store file
export * from './agents';

// DEFAULT EXPORT:
// This creates and exports a single object that combines all the store modules
// The spread operator (...) takes all properties from each imported module
// and combines them into one large store object

export default {
  // Spread all properties from the artifacts module
  // If artifacts exports { createArtifact, updateArtifact }, these become available here
  ...artifacts,

  // Spread all properties from families module
  // Might include things like { currentFamily, setFamily, availableFamilies }
  ...families,

  // Spread all properties from endpoints module
  // Could include { apiUrl, setEndpoint, connectionStatus }
  ...endpoints,

  // Spread all properties from user module
  // Might have { currentUser, login, logout, userPreferences }
  ...user,

  // Spread all properties from text module
  // Could contain { messages, updateText, textHistory }
  ...text,

  // Spread all properties from toast module
  // Might include { showToast, hideToast, toastQueue }
  ...toast,

  // Spread all properties from submission module
  // Could have { isSubmitting, submitForm, submissionError }
  ...submission,

  // Spread all properties from search module
  // Might contain { searchResults, performSearch, searchHistory }
  ...search,

  // Spread all properties from prompts module
  // Could include { savedPrompts, createPrompt, deletePrompt }
  ...prompts,

  // Spread all properties from preset module
  // Might have { activePreset, savePreset, loadPreset }
  ...preset,

  // Spread all properties from language module
  // Could contain { currentLanguage, setLanguage, translations }
  ...lang,

  // Spread all properties from settings module
  // Might include { theme, notifications, apiSettings }
  ...settings,

  // Spread all properties from misc module
  // Could have various utility functions and state
  ...misc,

  // Spread all properties from temporary module
  // Might contain { tempData, clearTemp, sessionState }
  ...isTemporary,
};

// HOW THIS WORKS IN PRACTICE:
// Other components in the app can import this store like:
// import store from '@/store'
// 
// Then they can access any functionality from any module:
// store.showToast('Hello!') // from toast module
// store.setCurrentUser(userData) // from user module
// store.performSearch(query) // from search module
// 
// This pattern is common in React applications using state management libraries
// like Zustand, where you want to centralize all your state but keep it organized
// in separate, focused modules.