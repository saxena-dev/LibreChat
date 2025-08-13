// This is the main entry point file for the LibreChat React application

// Import regenerator-runtime to enable async/await functionality in older browsers
// This polyfill allows modern JavaScript features to work in environments that don't natively support them
import 'regenerator-runtime/runtime';

// Import the createRoot function from React 18's new rendering API
// createRoot is the modern way to render React apps (replaces the older ReactDOM.render)
import { createRoot } from 'react-dom/client';

// Import internationalization (i18n) configuration
// This sets up multi-language support for the application
// The import executes the i18n setup code immediately when the app starts
import './locales/i18n';

// Import the main App component that contains all the application logic
// This is the root component that will be rendered inside the HTML root element
import App from './App';

// Import global CSS stylesheets
// These styles will be applied throughout the entire application
import './style.css';      // Main application styles
import './mobile.css';     // Mobile-specific responsive styles

// Import the API Error Boundary Provider component
// This is a React Context Provider that wraps the app to handle API errors gracefully
// Error boundaries catch JavaScript errors anywhere in the component tree and display fallback UI
import { ApiErrorBoundaryProvider } from './hooks/ApiErrorBoundaryContext';

// Import KaTeX CSS for mathematical equation rendering
// KaTeX is a library for displaying mathematical notation in web browsers
import 'katex/dist/katex.min.css';           // Core KaTeX styles for math rendering
import 'katex/dist/contrib/copy-tex.js';     // Additional functionality to copy TeX code

// Find the HTML element with id="root" in the public/index.html file
// This is where our entire React application will be mounted/rendered
const container = document.getElementById('root');

// Create a React root using the new React 18 API
// This root will manage the rendering and updates of our React component tree
const root = createRoot(container);

// Render the application into the DOM
// The component hierarchy is:
// 1. ApiErrorBoundaryProvider (outermost) - handles API errors across the app
// 2. App (innermost) - the main application component
root.render(
  <ApiErrorBoundaryProvider>
    <App />
  </ApiErrorBoundaryProvider>,
);