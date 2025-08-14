// client/src/Providers/index.ts

/*
 * Providers Index - LibreChat Context Providers Export Hub
 * 
 * This file serves as the central export point for all React Context providers
 * used throughout the LibreChat application. Context providers enable global
 * state management and data sharing between components without prop drilling.
 * 
 * Export Pattern Explanation:
 * - Named exports (export *) re-export all named members from a module
 * - Default exports (export { default as Name }) rename and re-export default exports
 * - This barrel pattern simplifies imports in consuming components
 */

// Assistant-related context providers
// AssistantsProvider: Manages OpenAI Assistant instances and their configurations
export { default as AssistantsProvider } from './AssistantsContext';

// AgentsProvider: Manages AI agent instances and their behavior settings
export { default as AgentsProvider } from './AgentsContext';

// UI State Management Providers
// ActivePanelContext: Tracks which sidebar panel is currently open (chat list, settings, etc.)
export * from './ActivePanelContext';

// AgentPanelContext: Controls the agent configuration panel visibility and state
export * from './AgentPanelContext';

// Core Chat Functionality Providers
// ChatContext: Central provider for chat state, messages, and conversation management
export * from './ChatContext';

// ShareContext: Manages chat sharing functionality and permissions
export * from './ShareContext';

// File Management Providers
// FileMapContext: Tracks uploaded files and their metadata across conversations
export * from './FileMapContext';

// Chat State Providers
// AddedChatContext: Manages newly created chat conversations before they're saved
export * from './AddedChatContext';

// Editor and Input Providers
// EditorContext: Controls the message input editor state and formatting
export * from './EditorContext';

// ChatFormContext: Manages the chat form submission, validation, and state
export * from './ChatFormContext';

// User Content Management Providers
// BookmarkContext: Handles bookmarked messages and conversations
export * from './BookmarkContext';

// MessageContext: Provides message-specific actions like edit, delete, regenerate
export * from './MessageContext';

// Dashboard and Analytics Providers
// DashboardContext: Manages dashboard data, statistics, and user activity
export * from './DashboardContext';

// Assistant Management (Named Exports)
// Re-exports all named members from AssistantsContext (types, hooks, utilities)
export * from './AssistantsContext';

// Agent Management (Named Exports)
// Re-exports all named members from AgentsContext (types, hooks, utilities)
export * from './AgentsContext';

// Mapping and Caching Providers
// AssistantsMapContext: Caches assistant data to avoid repeated API calls
export * from './AssistantsMapContext';

// AnnouncerContext: Manages system announcements and notifications
export * from './AnnouncerContext';

// AgentsMapContext: Caches agent data for performance optimization
export * from './AgentsMapContext';

// Content Generation Providers
// ArtifactContext: Manages individual artifact (generated content) state
export * from './ArtifactContext';

// CodeBlockContext: Handles code block rendering, syntax highlighting, and actions
export * from './CodeBlockContext';

// Tool Integration Providers
// ToolCallsMapContext: Maps and caches tool execution results and states
export * from './ToolCallsMapContext';

// Conversation Management Providers
// SetConvoContext: Handles conversation switching and state management
export * from './SetConvoContext';

// Search and Discovery Providers
// SearchContext: Manages search functionality across messages and conversations
export * from './SearchContext';

// UI Component Providers
// BadgeRowContext: Controls badge display and interaction in list components
export * from './BadgeRowContext';

// SidePanelContext: Manages sidebar panel state and content
export * from './SidePanelContext';

// ArtifactsContext: Global management of all artifacts (generated content items)
export * from './ArtifactsContext';

// Additional Default Export
// BadgeRowProvider: Provides badge row functionality as a default export
// This suggests the BadgeRowContext also exports a provider component
export { default as BadgeRowProvider } from './BadgeRowContext';

/*
 * Usage Pattern in Components:
 * 
 * // Import multiple providers
 * import { ChatProvider, FileMapProvider } from '@/Providers';
 * 
 * // Import specific provider
 * import { AssistantsProvider } from '@/Providers';
 * 
 * // The barrel export pattern allows clean, organized imports
 * // instead of importing from individual files scattered throughout the codebase
 */