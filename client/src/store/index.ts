// client/src/store/index.ts

/**
 * LIBRECHAT CENTRAL STORE MODULE
 * 
 * This file serves as the main entry point for LibreChat's state management system.
 * It follows a modular architecture pattern where different aspects of the application
 * state are managed in separate modules, then combined here into one unified store.
 * 
 * ARCHITECTURAL PATTERN:
 * - Each module handles a specific domain (user auth, settings, conversations, etc.)
 * - This index file imports all modules and re-exports them as a single object
 * - Components throughout the app can import this single store to access any functionality
 * 
 * TYPESCRIPT CONCEPTS DEMONSTRATED:
 * - Module imports/exports with different syntaxes (default vs named exports)
 * - Spread operator for object composition
 * - Re-export patterns for creating unified APIs
 * 
 * BENEFITS OF THIS APPROACH:
 * - Separation of concerns: Each module focuses on one responsibility
 * - Maintainability: Changes to one feature don't affect others
 * - Testability: Individual modules can be tested in isolation
 * - Developer experience: Single import gives access to entire state system
 */

// IMPORT SECTION: Bringing in all state management modules
// Each import represents a different slice of the application's state and functionality

/**
 * ARTIFACTS MODULE - Handles AI-generated content management
 * Using "import * as" syntax to import all named exports as a single object
 * This module likely manages code snippets, documents, and other AI-created content
 */
import * as artifacts from './artifacts';

/**
 * MODEL FAMILIES MODULE - Manages different AI model providers and configurations
 * Default import pattern (the module exports a single main object)
 * Handles things like GPT models, Claude models, and their specific settings
 */
import families from './families';

/**
 * ENDPOINTS MODULE - Manages API endpoints and connection configurations
 * Handles different API providers, custom endpoints, and connection settings
 * Critical for LibreChat's multi-provider architecture
 */
import endpoints from './endpoints';

/**
 * USER MODULE - Handles user authentication and profile management
 * Manages login state, user preferences, authentication tokens, and user data
 * Central to the application's security and personalization features
 */
import user from './user';

/**
 * TEXT MODULE - Manages text content and possibly internationalization
 * Could handle message content, text processing, or UI text strings
 * Important for chat applications where text is the primary content type
 */
import text from './text';

/**
 * TOAST MODULE - Controls notification system
 * Manages those temporary popup messages that inform users about actions
 * (success messages, error alerts, information notices, etc.)
 */
import toast from './toast';

/**
 * SUBMISSION MODULE - Handles form submissions and their lifecycle
 * Manages loading states, error handling, and success states for user interactions
 * Critical for chat submissions, settings changes, and other user actions
 */
import submission from './submission';

/**
 * SEARCH MODULE - Manages search functionality across the application
 * Handles conversation search, message search, and search result management
 * Important feature for users with large conversation histories
 */
import search from './search';

/**
 * PRESET MODULE - Manages conversation presets and templates
 * Handles saved conversation configurations that users can quickly apply
 * Allows users to set up recurring conversation patterns or model settings
 */
import preset from './preset';

/**
 * PROMPTS MODULE - Manages user-created prompts and prompt templates
 * Handles the creation, storage, and management of reusable prompts
 * Important for power users who create custom AI interaction patterns
 */
import prompts from './prompts';

/**
 * LANGUAGE MODULE - Handles internationalization and localization
 * Manages current language setting and probably translation strings
 * Critical for LibreChat's global user base
 */
import lang from './language';

/**
 * SETTINGS MODULE - Manages application settings and user preferences
 * Handles theme, notification preferences, API configurations, and other user settings
 * Central to customizing the user experience
 */
import settings from './settings';

/**
 * MISC MODULE - Contains miscellaneous state that doesn't fit other categories
 * Often used for utility functions, temporary state, or cross-cutting concerns
 * Provides flexibility for state that doesn't warrant its own module
 */
import misc from './misc';

/**
 * TEMPORARY MODULE - Manages ephemeral state
 * Handles data that should be cleared on page refresh or session end
 * Important for performance and preventing stale data issues
 */
import isTemporary from './temporary';

/**
 * RE-EXPORT PATTERN
 * This line re-exports all named exports from the agents module directly
 * This allows other parts of the app to import agent functionality
 * directly from this main store file without knowing the internal structure
 * 
 * Example: Instead of `import { agent } from '@/store/agents'`
 * Components can use: `import { agent } from '@/store'`
 */
export * from './agents';

/**
 * MAIN STORE EXPORT
 * This creates the unified store object by combining all imported modules
 * using the spread operator (...) to merge all properties into one object
 * 
 * TYPESCRIPT SPREAD OPERATOR EXPLANATION:
 * The spread operator takes all properties from an object and "spreads" them
 * into the new object. If multiple modules export the same property name,
 * the last one in the list will override the previous ones.
 * 
 * RESULTING STORE STRUCTURE:
 * The final store object will contain all functions and state from every module,
 * accessible as if they were all defined in one place.
 */
export default {
  /**
   * ARTIFACTS - Spread all artifact-related functionality
   * Might include: { createArtifact, updateArtifact, deleteArtifact, artifactsList }
   * Handles AI-generated content like code blocks, documents, and media
   */
  ...artifacts,

  /**
   * FAMILIES - Spread all model family functionality
   * Might include: { currentFamily, setFamily, availableFamilies, familySettings }
   * Manages different AI model providers and their configurations
   */
  ...families,

  /**
   * ENDPOINTS - Spread all endpoint management functionality
   * Might include: { apiUrl, setEndpoint, connectionStatus, testConnection }
   * Handles API connections and endpoint configurations
   */
  ...endpoints,

  /**
   * USER - Spread all user-related functionality
   * Might include: { currentUser, login, logout, updateProfile, isAuthenticated }
   * Manages user authentication state and profile information
   */
  ...user,

  /**
   * TEXT - Spread all text management functionality
   * Might include: { messages, updateText, textHistory, formatText }
   * Handles text content and processing throughout the application
   */
  ...text,

  /**
   * TOAST - Spread all notification functionality
   * Might include: { showToast, hideToast, toastQueue, clearAllToasts }
   * Manages user notifications and feedback messages
   */
  ...toast,

  /**
   * SUBMISSION - Spread all form submission functionality
   * Might include: { isSubmitting, submitMessage, submissionError, clearError }
   * Handles the lifecycle of user interactions and form submissions
   */
  ...submission,

  /**
   * SEARCH - Spread all search functionality
   * Might include: { searchResults, performSearch, clearSearch, searchHistory }
   * Manages search operations across conversations and messages
   */
  ...search,

  /**
   * PROMPTS - Spread all prompt management functionality
   * Might include: { savedPrompts, createPrompt, updatePrompt, deletePrompt }
   * Handles user-created prompts and prompt templates
   */
  ...prompts,

  /**
   * PRESET - Spread all preset management functionality
   * Might include: { activePreset, savePreset, loadPreset, deletePreset }
   * Manages conversation presets and configuration templates
   */
  ...preset,

  /**
   * LANGUAGE - Spread all internationalization functionality
   * Might include: { currentLanguage, setLanguage, translations, availableLanguages }
   * Handles language selection and localization
   */
  ...lang,

  /**
   * SETTINGS - Spread all settings functionality
   * Might include: { theme, setTheme, notifications, apiSettings, saveSettings }
   * Manages user preferences and application configuration
   */
  ...settings,

  /**
   * MISC - Spread miscellaneous functionality
   * Might include various utility functions and cross-cutting state
   * Provides flexibility for features that don't fit in other categories
   */
  ...misc,

  /**
   * TEMPORARY - Spread temporary state functionality
   * Might include: { tempData, clearTemp, sessionState, cacheData }
   * Manages ephemeral data that shouldn't persist across sessions
   */
  ...isTemporary,
};

/**
 * USAGE EXAMPLES IN COMPONENTS:
 * 
 * // Importing the unified store
 * import store from '@/store';
 * 
 * // Accessing functionality from different modules
 * store.showToast('Message sent successfully!'); // from toast module
 * store.setCurrentUser(userData); // from user module
 * store.performSearch('previous conversations'); // from search module
 * store.savePreset(conversationConfig); // from preset module
 * 
 * // In React components with hooks (if using Zustand or similar)
 * const currentUser = store.currentUser;
 * const isSubmitting = store.isSubmitting;
 * const searchResults = store.searchResults;
 * 
 * ADVANTAGES OF THIS PATTERN:
 * 
 * 1. SINGLE IMPORT: Components only need to import one store
 * 2. MODULAR DEVELOPMENT: Each team member can work on separate modules
 * 3. EASY TESTING: Individual modules can be tested in isolation
 * 4. CLEAR ORGANIZATION: Related functionality is grouped together
 * 5. SCALABILITY: New modules can be added without changing existing code
 * 6. TYPE SAFETY: TypeScript can infer types from each module
 * 
 * COMMON STATE MANAGEMENT LIBRARIES THAT USE THIS PATTERN:
 * - Zustand (lightweight state management)
 * - Redux Toolkit (with store configuration)
 * - Valtio (proxy-based state management)
 * - Jotai (atomic state management)
 */