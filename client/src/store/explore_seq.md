# LibreChat Store Modules - Exploration Priority

## **CRITICAL - Start Here** (Core Chat Functionality)

### 1. **submission** - `./submission`
- **Why First**: Controls the heart of the chat experience - sending messages to AI
- **Contains**: Message sending states, API call handling, loading indicators
- **Impact**: Understanding this explains how conversations actually work

### 2. **endpoints** - `./endpoints`  
- **Why Critical**: Manages connections to different AI services (OpenAI, Anthropic, etc.)
- **Contains**: API configurations, model selections, connection status
- **Impact**: Shows how LibreChat connects to various AI providers

### 3. **user** - `./user`
- **Why Essential**: Handles authentication and user session management
- **Contains**: Login/logout, user profiles, permissions, auth tokens
- **Impact**: Required for understanding who can access what

## **HIGH PRIORITY** (Core Features)

### 4. **text** - `./text`
- **Why Important**: Manages the actual conversation content
- **Contains**: Message history, conversation threads, text processing
- **Impact**: Central to understanding how conversations are stored/displayed

### 5. **search** - `./search`
- **Why Key**: Enables finding past conversations and content
- **Contains**: Search algorithms, indexing, result filtering
- **Impact**: Major UX feature for conversation management

### 6. **artifacts** - `./artifacts`  
- **Why Significant**: Handles AI-generated content like code, documents
- **Contains**: Code execution, document rendering, artifact lifecycle
- **Impact**: Core differentiator feature of LibreChat

## **MEDIUM PRIORITY** (User Experience)

### 7. **settings** - `./settings`
- **Why Useful**: Controls app behavior and user preferences  
- **Contains**: Theme, notifications, API keys, model preferences
- **Impact**: Affects entire user experience

### 8. **toast** - `./toast`
- **Why Helpful**: User feedback system for actions/errors
- **Contains**: Notification queue, success/error messages, timing
- **Impact**: Important for UX but not core functionality

### 9. **families** - `./families`
- **Why Relevant**: Organizes different AI model types
- **Contains**: Model categorization, family-specific settings
- **Impact**: Helps users choose appropriate AI models

## **LOWER PRIORITY** (Supporting Features)

### 10. **preset** - `./preset`
- **Why Secondary**: Saves conversation templates
- **Contains**: Saved configurations, quick-start templates
- **Impact**: Convenience feature for power users

### 11. **prompts** - `./prompts`
- **Why Secondary**: Manages reusable prompt templates
- **Contains**: Prompt library, custom prompts, prompt sharing
- **Impact**: Power-user feature for consistent interactions

### 12. **agents** - `./agents` *(re-exported)*
- **Why Explore**: Likely handles autonomous AI agents/assistants
- **Contains**: Agent configurations, multi-step workflows
- **Impact**: Advanced feature that may build on core chat

## **OPTIONAL** (Utility & Polish)

### 13. **lang/language** - `./language`
- **Why Last**: Internationalization support
- **Contains**: Translations, locale settings, text formatting
- **Impact**: Important for global users but not core logic

### 14. **misc** - `./misc`
- **Why Last**: Utility functions and edge cases
- **Contains**: Helper functions, miscellaneous state
- **Impact**: Supporting code that doesn't fit elsewhere

### 15. **isTemporary/temporary** - `./temporary`
- **Why Last**: Session-specific temporary state
- **Contains**: Temporary data, session cleanup
- **Impact**: Performance/cleanup feature

---

## **Recommended Exploration Order**

1. **Start with `submission` + `endpoints`** - understand the chat flow
2. **Add `user` + `text`** - complete the core conversation loop  
3. **Explore `search` + `artifacts`** - key differentiating features
4. **Review `settings` + `toast`** - round out the user experience
5. **Investigate remaining modules** based on specific interests

## **Pro Tips**

- **Focus on state shapes first** - what data does each module manage?
- **Look for action creators** - what functions trigger state changes?
- **Trace data flow** - how do modules interact with each other?
- **Check for side effects** - API calls, localStorage, external services