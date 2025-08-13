// Import statements - bringing in external code we need
import { atom, selector } from 'recoil'; // Recoil is a state management library for React
import { EModelEndpoint } from 'librechat-data-provider'; // Enum containing endpoint types
import type { TEndpointsConfig } from 'librechat-data-provider'; // TypeScript type definition for endpoint config

/**
 * DEFAULT CONFIGURATION OBJECT
 * 
 * This creates a default configuration where all AI service endpoints are initially set to null.
 * Think of this as a template that defines which AI services the app supports.
 * 
 * Each key represents a different AI service endpoint:
 * - azureOpenAI: Microsoft's Azure OpenAI service
 * - azureAssistants: Azure's assistant APIs
 * - assistants: OpenAI assistants
 * - agents: AI agent endpoints
 * - openAI: Direct OpenAI API
 * - chatGPTBrowser: ChatGPT web interface
 * - gptPlugins: GPT plugins system
 * - google: Google's AI services (like Bard/Gemini)
 * - anthropic: Anthropic's Claude AI
 * - custom: User-defined custom endpoints
 * 
 * The 'null' values indicate these endpoints are not configured yet.
 */
const defaultConfig: TEndpointsConfig = {
  [EModelEndpoint.azureOpenAI]: null,
  [EModelEndpoint.azureAssistants]: null,
  [EModelEndpoint.assistants]: null,
  [EModelEndpoint.agents]: null,
  [EModelEndpoint.openAI]: null,
  [EModelEndpoint.chatGPTBrowser]: null,
  [EModelEndpoint.gptPlugins]: null,
  [EModelEndpoint.google]: null,
  [EModelEndpoint.anthropic]: null,
  [EModelEndpoint.custom]: null,
};

/**
 * MAIN ENDPOINTS CONFIGURATION ATOM
 * 
 * An "atom" in Recoil is like a piece of global state that components can read from and write to.
 * Think of it as a global variable that React components can subscribe to for updates.
 * 
 * This atom stores the current configuration for all endpoints.
 * When any component updates this atom, all components using it will automatically re-render.
 * 
 * Properties:
 * - key: A unique identifier for this piece of state (must be unique across the app)
 * - default: The initial value when the app starts (uses our defaultConfig from above)
 */
const endpointsConfig = atom<TEndpointsConfig>({
  key: 'endpointsConfig',
  default: defaultConfig,
});

/**
 * ENDPOINTS QUERY ENABLED ATOM
 * 
 * This is a simple boolean flag that controls whether the app should actively
 * query/fetch endpoint configurations from the server.
 * 
 * When true: The app will make API calls to get the latest endpoint configurations
 * When false: The app won't make these API calls (maybe to save bandwidth or when offline)
 * 
 * Starts as 'true' by default, meaning queries are enabled when the app loads.
 */
const endpointsQueryEnabled = atom<boolean>({
  key: 'endpointsQueryEnabled',
  default: true,
});

/**
 * PLUGINS SELECTOR
 * 
 * A "selector" in Recoil is like a computed value - it derives its value from other atoms.
 * Think of it as a formula that automatically recalculates when its dependencies change.
 * 
 * This selector extracts plugin information from the endpoints configuration.
 * It specifically looks at the 'gptPlugins' endpoint and returns its plugins object.
 * 
 * How it works:
 * 1. Gets the current endpointsConfig atom value
 * 2. Looks for the gptPlugins property in that config
 * 3. Returns the plugins object from gptPlugins, or an empty object if none exists
 * 
 * The '|| {}' is a fallback - if config is null/undefined, use empty object instead
 */
const plugins = selector({
  key: 'plugins',
  get: ({ get }) => {
    // Get the current endpoints configuration
    const config = get(endpointsConfig) || {};
    // Return the plugins from gptPlugins endpoint, or empty object if not found
    return config.gptPlugins?.plugins || {};
  },
});

/**
 * ENDPOINTS FILTER SELECTOR
 * 
 * This selector creates a "filter" object that shows which endpoints are available/enabled.
 * It converts the endpoint configurations into simple true/false values.
 * 
 * How it works:
 * 1. Gets the current endpointsConfig
 * 2. Creates a new empty filter object
 * 3. For each endpoint key in the config:
 *    - If the endpoint has a configuration (not null), set filter[key] = true
 *    - If the endpoint is null/undefined, set filter[key] = false
 * 4. Returns this filter object
 * 
 * Example result:
 * {
 *   openAI: true,      // This endpoint is configured
 *   google: false,     // This endpoint is not configured
 *   anthropic: true,   // This endpoint is configured
 *   // ... etc
 * }
 * 
 * The !!config[key] is a JavaScript trick:
 * - ! converts any value to its opposite boolean (null becomes true, "text" becomes false)
 * - !! converts it back, effectively turning any "truthy" value into true and "falsy" into false
 */
const endpointsFilter = selector({
  key: 'endpointsFilter',
  get: ({ get }) => {
    // Get current endpoints configuration, defaulting to empty object if null
    const config = get(endpointsConfig) || {};

    // Create new filter object
    const filter = {};

    // Loop through each endpoint key in the configuration
    for (const key of Object.keys(config)) {
      // Convert each endpoint's value to a simple true/false
      // True = endpoint is configured, False = endpoint is null/undefined
      filter[key] = !!config[key];
    }

    return filter;
  },
});

/**
 * EXPORTED MODULE
 * 
 * This exports all our state management pieces so other parts of the app can use them.
 * Other components will import this file and use these atoms and selectors to:
 * - Read current endpoint configurations
 * - Update endpoint settings
 * - Check which endpoints are available
 * - Access plugin information
 * - Control whether endpoint queries are enabled
 */
export default {
  plugins,                // Selector for accessing GPT plugins
  endpointsConfig,       // Main atom storing all endpoint configurations
  endpointsFilter,       // Selector showing which endpoints are enabled (true/false)
  defaultConfig,         // The initial default configuration object
  endpointsQueryEnabled, // Atom controlling whether to query endpoints from server
};