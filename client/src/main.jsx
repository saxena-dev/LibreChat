// client/src/main.jsx
// This is the main entry point file for the LibreChat React application.
// When users navigate to the LibreChat website, this file is the first JavaScript code that executes.
// It sets up the entire application environment and renders the root React component into the HTML page.

// Import regenerator-runtime to enable async/await functionality in older browsers.
// This polyfill transforms modern async/await syntax into generator functions that work in ES5 environments.
// Without this, users on older browsers would see "regeneratorRuntime is not defined" errors when
// the application tries to use async/await for API calls or other asynchronous operations.
import 'regenerator-runtime/runtime';

// Import the createRoot function from React 18's new rendering API.
// React 18 introduced a new root API that replaces the legacy ReactDOM.render() method.
// createRoot enables React 18's concurrent features like automatic batching and time slicing,
// which improve performance by allowing React to interrupt and prioritize rendering work.
// The old ReactDOM.render() is deprecated and will show console warnings in React 18+.
import { createRoot } from 'react-dom/client';

// Import internationalization (i18n) configuration.
// This sets up multi-language support for the LibreChat application.
// The import statement executes the i18n setup code immediately when the app starts.
// This configuration typically includes:
// - Loading translation files for supported languages (English, Spanish, French, etc.)
// - Setting up language detection (browser preference, localStorage, etc.)
// - Configuring fallback languages if translations are missing
// - Initializing the translation functions used throughout the app
import './locales/i18n';

// Import the main App component that contains all the application logic.
// This is the root React component that orchestrates the entire LibreChat interface.
// The App component typically handles:
// - Authentication state and login/logout flows
// - Main application routing (chat, settings, profile pages)
// - Global state management and context providers
// - Layout structure (header, sidebar, main content area)
// - Theme management and user preferences
import App from './App';

// Import global CSS stylesheets that apply to the entire application.
// These styles are loaded once and affect all components throughout the app.
import './style.css';      // Main application styles (colors, typography, layout basics)
import './mobile.css';     // Mobile-specific responsive styles (media queries, touch interactions)

// Import the API Error Boundary Provider component.
// This is a React Context Provider that implements the Error Boundary pattern.
// Error boundaries are React components that catch JavaScript errors anywhere in their child component tree,
// log those errors, and display a fallback UI instead of crashing the entire application.
// The ApiErrorBoundaryProvider specifically handles:
// - Network request failures (timeouts, server errors, connection issues)
// - API response parsing errors (malformed JSON, unexpected data structures)
// - Authentication errors (expired tokens, insufficient permissions)
// - Rate limiting and quota exceeded errors
// Without this boundary, any unhandled API error would crash the entire chat interface.
import { ApiErrorBoundaryProvider } from './hooks/ApiErrorBoundaryContext';

// Import KaTeX CSS for mathematical equation rendering.
// KaTeX is a fast, self-contained JavaScript library for rendering TeX math notation on the web.
// LibreChat supports LaTeX mathematical expressions in chat messages, which KaTeX converts to formatted equations.
import 'katex/dist/katex.min.css';           // Core KaTeX styles for rendering mathematical notation
import 'katex/dist/contrib/copy-tex.js';     // Additional functionality allowing users to copy TeX source code from rendered equations

// Find the HTML element with id="root" in the public/index.html file.
// This is the mounting point where our entire React application will be injected.
// The HTML page contains a simple <div id="root"></div> element, and React will replace its
// contents with our dynamic component tree. This is the standard pattern for Single Page Applications (SPAs).
const container = document.getElementById('root');

// Create a React root using the new React 18 API.
// This root object manages the rendering lifecycle of our React component tree.
// Key benefits of createRoot over legacy ReactDOM.render():
// - Enables concurrent features (time slicing, automatic batching)
// - Better error handling and recovery
// - Improved hydration for server-side rendering
// - Support for React 18+ features like Suspense, Transitions, etc.
const root = createRoot(container);

// Render the application into the DOM.
// This creates the initial component tree and starts React's rendering cycle.
// The component hierarchy establishes the application's structure:
//
// 1. ApiErrorBoundaryProvider (outermost layer)
//    - Catches and handles any API-related errors from child components
//    - Provides error recovery mechanisms (retry buttons, fallback UI)
//    - Prevents the entire app from crashing due to network issues
//
// 2. App (inner layer)
//    - Contains the main application logic and routing
//    - Manages authentication state and user sessions
//    - Renders the primary user interface (chat interface, settings, etc.)
//
// This nested structure ensures that even if the main App component encounters API errors,
// the ApiErrorBoundaryProvider will catch them and display appropriate error messages
// instead of showing a blank white screen to users.
root.render(
  <ApiErrorBoundaryProvider>
    <App />
  </ApiErrorBoundaryProvider>,
);