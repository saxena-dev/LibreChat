// client/src/store/submission.ts

// Import the 'atom' function from Recoil library for state management.
// Recoil is a state management library for React that provides fine-grained,
// reactive state without prop drilling or complex reducers.
// An 'atom' represents a single piece of state that components can subscribe to.
import { atom } from 'recoil';

// Import the TypeScript type definition for submission data.
// This comes from the librechat-data-provider package and ensures type safety
// by defining the exact structure and properties a submission object must have.
import { TSubmission } from 'librechat-data-provider';

// ========================================
// GLOBAL STATE ATOMS DEFINITION
// ========================================

/*
 * ATOM: submission
 * 
 * PURPOSE: Central trigger for message sending operations
 * This atom acts as the primary mechanism to initiate new message submissions
 * in the LibreChat application. When a component sets this atom to a non-null
 * value, it triggers the message sending workflow.
 * 
 * TYPE: TSubmission | null
 * - null: No active submission (default state)
 * - TSubmission object: Contains all data needed to send a message
 * 
 * WORKFLOW:
 * 1. User composes a message in the UI
 * 2. Component creates a TSubmission object with required data
 * 3. Component sets this atom with the submission object
 * 4. Message sending logic (likely in a useEffect hook elsewhere) detects the change
 * 5. System processes the submission and sends the message
 * 6. After processing, this atom is reset to null
 * 
 * TSUBMISSION STRUCTURE:
 * {
 *   conversation: {     // Target conversation context
 *     model: string,           // AI model to use (e.g., "gpt-4", "claude-3")
 *     chatGptLabel: string,    // Display label for the model
 *     promptPrefix: string,    // System prompt or context prefix
 *     ...other conversation metadata
 *   },
 *   messages: Message[],      // Array of previous messages in conversation history
 *   message: Message,         // The new message being submitted by user
 *   initialResponse: Message, // Pre-created response object (for AI's reply)
 *   isRegenerate: boolean,    // true = regenerating previous response, false = new message
 * }
 */
const submission = atom<TSubmission | null>({
  // Unique identifier across the entire Recoil state tree.
  // Must be globally unique to prevent state collisions.
  key: 'submission',

  // Initial value when the application starts.
  // null indicates no submission is pending or in progress.
  default: null,
});

/*
 * ATOM: isSubmitting
 * 
 * PURPOSE: Track submission state for UI feedback
 * This boolean atom manages the loading/processing state during message submissions.
 * It provides a way for UI components to show appropriate feedback (spinners,
 * disabled buttons, etc.) while a message is being processed.
 * 
 * TYPE: boolean
 * - false: No submission in progress (default)
 * - true: Submission is currently being processed
 * 
 * USAGE PATTERNS:
 * - Set to true when submission starts
 * - Used to disable send button during processing
 * - Used to show loading indicators
 * - Used to prevent duplicate submissions
 * - Set to false when submission completes (success or error)
 */
const isSubmitting = atom({
  // Unique identifier for this boolean state.
  key: 'isSubmitting',

  // Default state - not submitting when app starts.
  // TypeScript automatically infers this as atom<boolean> due to the boolean default.
  default: false,
});

// ========================================
// MODULE EXPORTS
// ========================================

/*
 * Export both atoms as properties of a single object.
 * This pattern provides a clean namespace for related state atoms
 * and makes importing more convenient for consuming components.
 * 
 * IMPORT EXAMPLES:
 * 
 * // Import the entire store object
 * import submissionStore from './store/submission';
 * const [submission, setSubmission] = useRecoilState(submissionStore.submission);
 * const [isSubmitting, setIsSubmitting] = useRecoilState(submissionStore.isSubmitting);
 * 
 * // Or destructure specific atoms
 * import submissionStore from './store/submission';
 * const { submission, isSubmitting } = submissionStore;
 * 
 * TYPICAL COMPONENT USAGE FLOW:
 * 
 * 1. User types message and clicks send button
 * 2. Component validates input and creates TSubmission object
 * 3. Component calls setIsSubmitting(true) to show loading state
 * 4. Component calls setSubmission(submissionData) to trigger send
 * 5. Sending logic (in another component/hook) detects the submission change
 * 6. System processes the message and gets AI response
 * 7. After completion, setSubmission(null) and setIsSubmitting(false) are called
 * 8. UI returns to normal state, ready for next message
 * 
 * ERROR HANDLING:
 * If submission fails, isSubmitting should still be set to false to unlock the UI,
 * and submission should be reset to null to clear the failed attempt.
 */
export default {
  submission,
  isSubmitting,
};