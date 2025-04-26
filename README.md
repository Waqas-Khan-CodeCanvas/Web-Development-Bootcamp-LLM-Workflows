# Gemini AI Assistant

A modern web application for interacting with Google's Gemini AI API, built with Vue 3 and Tailwind CSS. This application provides a sleek interface for having conversations with Gemini AI models, analyzing images, and more.

![Gemini AI Assistant](https://i.imgur.com/example-screenshot.jpg)

## Features

- **Text Chat**: Engage in natural conversations with Gemini AI
- **Image Analysis**: Upload images for AI-powered visual analysis
- **Voice Input**: Use speech recognition for hands-free interaction
- **Theme Switching**: Toggle between dark and light themes
- **Conversation Management**:
  - Save conversation history locally
  - Export conversations as text files
  - Bookmark important responses
  - Copy responses to clipboard
- **Responsive Design**: Works on desktop and mobile devices
- **API Key Management**: Securely store your Gemini API key

## Live Demo

[View Demo](https://example.com/gemini-assistant-demo)

## Getting Started

### Prerequisites

- Node.js and npm installed
- Google Gemini API key (free or paid)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/gemini-assistant.git
   cd gemini-assistant
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run serve
   ```

4. Open your browser and navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Setting Up Your API Key

1. Click the settings icon (⚙️) in the bottom right corner
2. Enter your Gemini API key in the settings modal
3. Select your preferred Gemini model
4. Click "Save Settings"

### Text Conversations

1. Ensure you are in "Text" mode (default)
2. Type your prompt or question in the text area
3. Press Enter or click the "Send" button
4. View the AI's response in the conversation display

### Image Analysis

1. Switch to "Image" mode by clicking the Image tab
2. Upload an image by clicking the upload area
3. Enter a prompt about the image (e.g., "What's in this image?")
4. Press Enter or click the "Send" button
5. View the AI's analysis of the image

### Voice Input

1. Click the microphone icon in the input area
2. Speak your prompt clearly
3. Click the stop icon (previously microphone) to end recording
4. The transcribed text will appear in the input field
5. Send the prompt as usual

### Managing Conversations

- **Bookmarking**: Click the bookmark icon on any AI response to save it
- **Copying**: Click the copy icon to copy the response text
- **Exporting**: Click "Export Chat" to download the conversation as a text file
- **Clearing**: Click "Clear Chat" to start a new conversation

## Component Architecture

The application is built with Vue 3 using the Composition API and consists of the following components:

- **App.vue**: Main application component that orchestrates all other components
- **AppHeader.vue**: Contains the application title and theme toggle
- **InputControls.vue**: Manages text/image inputs and voice recording
- **ConversationDisplay.vue**: Renders the chat history and AI responses
- **SettingsModal.vue**: Provides interface for API key and model settings
- **ToastNotification.vue**: Displays temporary notification messages

## API Integration

The application uses Google's Gemini API:

- **Text-only prompts**: Uses the `generateContent` endpoint with text parts
- **Image prompts**: Uses the `generateContent` endpoint with both text and image parts

Response formatting includes handling for:

- Code blocks with syntax highlighting
- Markdown-style text formatting (bold, italic)
- Lists and paragraphs

## Customization

### Styling

The application uses Tailwind CSS for styling, making it easy to customize:

- Update color schemes in `src/assets/styles.css`
- Modify component templates to change layouts
- Adjust theme variables in the CSS `:root` section

### API Configuration

- Change default models in the `settings` object in `App.vue`
- Modify API request parameters in the `processTextPrompt` and `processImagePrompt` functions

## Browser Compatibility

- Chrome (recommended for best speech recognition support)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [Google Gemini API](https://ai.google.dev/) - AI model provider
- [Vue.js](https://vuejs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) - Icon library
