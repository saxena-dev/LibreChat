// client/src/store/artifacts.ts

// Import the 'atom' function from Recoil library
// Recoil is a state management library for React that allows components to share state
import { atom } from 'recoil';

// Import a logging utility for debugging purposes
import { logger } from '~/utils';

// Import TypeScript type definition for Artifact objects
// This ensures type safety - we know what properties an Artifact should have
import type { Artifact } from '~/common';

/**
 * MAIN ARTIFACTS STATE
 * This atom stores all artifacts in the application as a collection (like a dictionary/map)
 * 
 * Structure: Record<string, Artifact | undefined> | null
 * - Record<string, Artifact> means: an object where keys are strings and values are Artifact objects
 * - The "| undefined" part means some values might be undefined (missing/deleted artifacts)
 * - The "| null" part means the entire collection could be null (no artifacts loaded yet)
 * 
 * Example of what this might look like:
 * {
 *   "artifact-123": { id: "artifact-123", title: "My Document", content: "..." },
 *   "artifact-456": { id: "artifact-456", title: "My Code", content: "..." },
 *   "artifact-789": undefined  // This artifact was deleted but key still exists
 * }
 */
export const artifactsState = atom<Record<string, Artifact | undefined> | null>({
  // Unique identifier for this piece of state in Recoil's internal system
  key: 'artifactsState',

  // Initial value when the app starts - null means no artifacts loaded yet
  default: null,

  // Effects are functions that run when this state changes
  // Think of them as "event listeners" for state changes
  effects: [
    // This effect function receives an object with helper functions
    ({ onSet, node }) => {
      // onSet registers a callback that runs whenever this atom's value changes
      onSet(async (newValue) => {
        // Log the state change for debugging purposes
        // This helps developers track when and how the artifacts state is being updated
        logger.log('artifacts', 'Recoil Effect: Setting artifactsState', {
          key: node.key,      // Will be 'artifactsState'
          newValue,           // The new value being set
        });
      });
    },
  ] as const, // 'as const' tells TypeScript this array won't change
});

/**
 * CURRENT ARTIFACT ID STATE
 * This atom tracks which artifact is currently selected/active in the UI
 * 
 * Type: string | null
 * - string: the ID of the currently selected artifact (e.g., "artifact-123")
 * - null: no artifact is currently selected
 */
export const currentArtifactId = atom<string | null>({
  // Unique identifier for this state
  key: 'currentArtifactId',

  // Initially no artifact is selected
  default: null,

  // Same logging pattern as above - track when the current selection changes
  effects: [
    ({ onSet, node }) => {
      onSet(async (newValue) => {
        logger.log('artifacts', 'Recoil Effect: Setting currentArtifactId', {
          key: node.key,      // Will be 'currentArtifactId'
          newValue,           // The new artifact ID being selected (or null)
        });
      });
    },
  ] as const,
});

/**
 * ARTIFACTS VISIBILITY STATE
 * This atom controls whether the artifacts panel/section is visible in the UI
 * 
 * Type: boolean
 * - true: artifacts panel is shown to the user
 * - false: artifacts panel is hidden
 */
export const artifactsVisibility = atom<boolean>({
  // Unique identifier for this state
  key: 'artifactsVisibility',

  // By default, show the artifacts panel when the app loads
  default: true,

  // Log when visibility is toggled (useful for debugging UI behavior)
  effects: [
    ({ onSet, node }) => {
      onSet(async (newValue) => {
        logger.log('artifacts', 'Recoil Effect: Setting artifactsVisibility', {
          key: node.key,      // Will be 'artifactsVisibility'
          newValue,           // true or false
        });
      });
    },
  ] as const,
});

/**
 * VISIBLE ARTIFACTS STATE
 * This atom stores a subset of artifacts that should be displayed in the UI
 * This is separate from artifactsState because you might want to:
 * - Filter artifacts (show only certain types)
 * - Sort artifacts differently
 * - Show a paginated view
 * 
 * Structure: Same as artifactsState - Record<string, Artifact | undefined> | null
 * But typically contains fewer items than the main artifactsState
 */
export const visibleArtifacts = atom<Record<string, Artifact | undefined> | null>({
  // Unique identifier for this state
  key: 'visibleArtifacts',

  // Initially no artifacts are marked as visible
  default: null,

  // Log changes to visible artifacts (helps debug filtering/display logic)
  effects: [
    ({ onSet, node }) => {
      onSet(async (newValue) => {
        logger.log('artifacts', 'Recoil Effect: Setting `visibleArtifacts`', {
          key: node.key,      // Will be 'visibleArtifacts'
          newValue,           // The filtered/visible artifacts
        });
      });
    },
  ] as const,
});

/**
 * HOW THESE ATOMS WORK TOGETHER:
 * 
 * 1. artifactsState: Holds ALL artifacts in the app
 * 2. visibleArtifacts: Holds a filtered subset that should be shown in the UI
 * 3. currentArtifactId: Tracks which one from visibleArtifacts is currently selected
 * 4. artifactsVisibility: Controls whether the whole artifacts panel is shown/hidden
 * 
 * Example flow:
 * 1. App loads artifacts into artifactsState
 * 2. User applies a filter, updating visibleArtifacts with matching items
 * 3. User clicks on an artifact, updating currentArtifactId
 * 4. User toggles the panel, updating artifactsVisibility
 * 
 * The logging effects help developers debug this flow by showing in the console
 * whenever any of these states change.
 */