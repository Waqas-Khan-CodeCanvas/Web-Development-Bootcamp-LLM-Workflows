# Gemini AI Assistant - Technical Documentation

This document provides technical details about the implementation of the Gemini AI Assistant web application, aimed at developers who want to understand or extend the codebase.

## Project Architecture

The project is built with Vue 3 using the Composition API and follows a component-based architecture. The application is structured as follows:

```
src/
├── assets/
│   └── styles.css          # Global CSS styles and theme variables
├── components/
│   ├── AppHeader.vue       # App header with title and theme toggle
│   ├── ConversationDisplay.vue # Chat history display component
│   ├── InputControls.vue   # User input handling (text/image/voice)
│   ├── SettingsModal.vue   # API key and model configuration
│   └── ToastNotification.vue # Notification popup component
├── App.vue                 # Main application component
└── main.js                 # Application entry point
```

## Component Breakdown

### main.js

The entry point of the application. It:

- Creates and mounts the Vue application
- Loads external resources (Font Awesome, Tailwind CSS)

### App.vue

The root component that:

- Manages application state
- Handles API requests to Gemini
- Coordinates child components
- Manages conversation history and settings
- Implements theme switching
- Formats AI responses (code blocks, markdown)

Key functionality:

- `processTextPrompt()`: Sends text-only prompts to Gemini API
- `processImagePrompt()`: Sends multimodal (text+image) prompts
- `formatResponse()`: Processes Gemini's response text to add styling
- `saveConversationHistory()`: Persists conversations to localStorage
- `exportConversationHistory()`: Exports conversations to a text file

### AppHeader.vue

A simple component that displays:

- The application title with gradient styling
- A theme toggle button that emits events to the parent

### InputControls.vue

Handles all user input functionality:

- Switches between text and image modes
- Manages text input areas
- Processes image uploads
- Implements speech recognition for voice input
- Tracks character counts

Key functionality:

- `switchMode()`: Toggles between text and image input modes
- `handleImageUpload()`: Processes uploaded images to base64
- `startSpeechRecognition()`: Activates browser's speech API
- `submitPrompt()`: Validates and emits user inputs to parent

### ConversationDisplay.vue

Displays the conversation history:

- Shows user messages and AI responses
- Formats AI responses with HTML content
- Implements bookmark functionality
- Provides copy-to-clipboard features
- Auto-scrolls to new messages

Key functionality:

- `scrollToBottom()`: Ensures newest messages are visible
- `toggleBookmark()`: Saves important responses to localStorage
- `copyToClipboard()`: Copies formatted response text

### SettingsModal.vue

A modal dialog for configuration:

- API key input (stored securely in localStorage)
- Model selection dropdown
- Save/close functionality

### ToastNotification.vue

A simple notification component:

- Shows temporary messages
- Includes animation effects
- Auto-dismisses after a timeout

## State Management

The application uses Vue's Composition API for state management:

- `ref()` for reactive primitive values
- `reactive()` for complex reactive objects
- `computed()` for derived values
- `watch()` for side effects

Key application state includes:

- `currentMode`: Current input mode (text/image)
- `conversationHistory`: Array of conversation messages
- `settings`: API key and model configuration
- `isDarkTheme`: Current theme setting

## API Integration

### Gemini API Endpoints

The application uses Google's Generative Language API:

1. Text Prompts:

```javascript
fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${settings.apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  }
);
```

2. Image Prompts:

```javascript
fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${settings.apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: base64Image } },
          ],
        },
      ],
    }),
  }
);
```

### Response Processing

The `formatResponse()` function handles Gemini's response text:

- Identifies and formats code blocks with syntax highlighting
- Converts markdown-style formatting to HTML
- Formats lists and paragraphs
- Adds copy functionality to code blocks

## Browser Storage

The application uses `localStorage` for persistence:

- `conversation-history`: Conversation messages history
- `bookmarked-responses`: User's saved responses
- `gemini-api-key`: User's API key
- `gemini-model`: Selected model name
- `theme`: User's theme preference

## Styling

The application uses:

- Tailwind CSS for utility classes (dynamically loaded)
- Custom CSS variables for theming
- CSS animations for UI interactions

Key styling features:

- Dark/light theme with CSS variables
- Gradient backgrounds and text
- Custom scrollbar styling
- Code block formatting
- Typing indicator animation

## Browser APIs

The application leverages:

- **Web Speech API**: For voice input functionality
- **Clipboard API**: For copy-to-clipboard features
- **File API**: For image upload and processing

## Optimization Techniques

- Character and token count estimation
- Conversation history size limiting (max 100 messages)
- Image resizing before API submission
- Debounced voice transcription

## Error Handling

The application includes error handling for:

- API request failures
- Image processing errors
- Speech recognition issues
- LocalStorage access problems

## Future Improvements

Potential enhancements:

- Streaming responses for faster initial display
- Additional Gemini model options
- Support for additional file types (PDFs, documents)
- Session management for multiple conversation threads
- End-to-end encryption for sensitive conversations
