// client/src/store/user.ts

// Import the 'atom' function from the Recoil state management library
// Recoil is used for managing global application state in React apps
import { atom } from 'recoil';

// Import TypeScript type definitions from the librechat-data-provider package
// 'type' keyword means these are only used for type checking, not runtime values
// TUser: defines the structure/shape of a user object
// TPlugin: defines the structure/shape of a plugin/tool object
import type { TUser, TPlugin } from 'librechat-data-provider';

// Create a Recoil atom to store user information
// An atom is like a piece of global state that components can read from and write to
const user = atom<TUser | undefined>({
  // 'key' is a unique identifier for this atom across the entire app
  // Must be unique - Recoil uses this internally to track the state
  key: 'user',

  // 'default' sets the initial value when the app first loads
  // undefined means no user is logged in initially
  // The <TUser | undefined> type annotation means this atom can hold either:
  //   - A TUser object (when someone is logged in)
  //   - undefined (when no one is logged in)
  default: undefined,
});

// Create a Recoil atom to store available tools/plugins
const availableTools = atom<Record<string, TPlugin>>({
  // Unique identifier for the available tools state
  key: 'availableTools',

  // Start with an empty object {}
  // The <Record<string, TPlugin>> type means this is an object where:
  //   - Keys are strings (probably tool/plugin names or IDs)
  //   - Values are TPlugin objects (the actual plugin data)
  //   - Example: { "calculator": {name: "Calculator", version: "1.0"}, "translator": {...} }
  default: {},
});

// Export both atoms as a single object for easy importing in other files
// Other components can import this and use: userStore.user or userStore.availableTools
// This creates a namespace to organize related state atoms together
export default {
  user,           // The user login state
  availableTools, // The available tools/plugins state
};