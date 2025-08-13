// Import the 'atom' function from Recoil library
// Recoil is a state management library for React applications
// An 'atom' represents a piece of state that components can subscribe to and update
import { atom } from 'recoil';

// Import the TypeScript type definition for submission data
// This comes from the librechat-data-provider package and defines the structure
// of what a submission object should look like
import { TSubmission } from 'librechat-data-provider';

// ========================================
// STATE ATOMS DEFINITION
// ========================================

// ATOM 1: submission
// This atom holds the current submission data or null if no submission is active
// 
// KEY BEHAVIOR:
// - When a new value is submitted to this state, it triggers sending a new message
// - Setting it to null cancels/abandons any current submission
// - This acts as the main trigger for message sending in the application
//
// STRUCTURE OF TSubmission OBJECT (when not null):
// {
//   conversation,     // Target conversation data - MUST include: model, chatGptLabel, promptPrefix
//   messages,         // Array of previous/old messages in the conversation
//   message,          // The new message being submitted/sent
//   initialResponse,  // The response message object
//   isRegenerate,     // Boolean flag - true if this is regenerating a previous response, false for new message
// }
const submission = atom<TSubmission | null>({
  // Unique identifier for this piece of state in Recoil
  // This key must be unique across the entire application
  key: 'submission',

  // Default/initial value when the app starts
  // null means no submission is active initially
  default: null,
});

// ATOM 2: isSubmitting
// This atom tracks whether a submission is currently in progress
// 
// PURPOSE:
// - Used to show loading states in the UI (like spinner, disabled buttons)
// - Prevents multiple submissions from happening simultaneously
// - Helps manage UI states during async operations
const isSubmitting = atom({
  // Unique identifier for this state
  key: 'isSubmitting',

  // Default value - false means not submitting initially
  // TypeScript infers this as atom<boolean> because default is boolean
  default: false,
});

// ========================================
// EXPORTS
// ========================================

// Export both atoms as properties of an object
// This allows other parts of the app to import and use these state atoms
// 
// USAGE EXAMPLE IN COMPONENTS:
// import submissionStore from './store/submission';
// const [currentSubmission, setSubmission] = useRecoilState(submissionStore.submission);
// const [submitting, setSubmitting] = useRecoilState(submissionStore.isSubmitting);
//
// TYPICAL FLOW:
// 1. User types a message and clicks send
// 2. Component sets isSubmitting to true (shows loading state)
// 3. Component creates submission object with conversation, message data
// 4. Component sets submission atom with the new submission data
// 5. This triggers the message sending logic elsewhere in the app
// 6. After message is sent, isSubmitting is set back to false
// 7. submission is set back to null to clear the trigger
export default {
  submission,
  isSubmitting,
};