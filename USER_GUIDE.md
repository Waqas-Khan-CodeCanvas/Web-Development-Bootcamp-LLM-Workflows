# Gemini AI Assistant - User Guide

Welcome to the Gemini AI Assistant! This guide will help you get the most out of this application.

## Getting Started

### Installation

You can access the Gemini AI Assistant in one of two ways:

1. **Web Version**: Visit [example.com/gemini-assistant](https://example.com/gemini-assistant) in your web browser
2. **Local Installation**:
   - Download the files from the repository
   - Open the folder
   - Open `index.html` in your web browser

### API Key Setup

Before you can use the assistant, you'll need a Google Gemini API key:

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Navigate to the API Keys section
4. Create a new key
5. Copy the key to your clipboard

### Configuring the Assistant

1. Open the Gemini AI Assistant
2. Click the settings icon (⚙️) in the bottom right corner
3. Paste your API key in the "Gemini API Key" field
4. Select your preferred model from the dropdown
5. Click "Save Settings"

## Using the Assistant

### Text Mode

Text mode allows you to have conversations with the Gemini AI model.

1. Ensure you're in Text mode (default, or click the "Text" tab)
2. Type your question or prompt in the text area
3. Press Enter or click the "Send" button
4. Wait for the AI to generate a response
5. Continue the conversation by typing more prompts

#### Tips for Text Mode

- Be specific in your questions
- You can ask follow-up questions to get more details
- For code generation, specify the programming language
- Include relevant context to get better responses

### Image Mode

Image mode allows you to upload an image and ask questions about it.

1. Switch to Image mode by clicking the "Image" tab
2. Upload an image by clicking on the upload area
3. Select an image file from your device (JPG, PNG)
4. Type a question about the image in the prompt field
5. Press Enter or click the "Send" button
6. Wait for the AI to analyze the image and respond

#### Tips for Image Mode

- Use clear, well-lit images
- Ask specific questions about the image
- Try questions like:
  - "What's in this image?"
  - "Can you describe what you see?"
  - "What text is visible in this image?"
  - "What's unusual about this picture?"

### Voice Input

You can use voice recognition to speak your prompts instead of typing.

1. Click the microphone icon in the input area
2. When the icon turns red, begin speaking your prompt
3. Speak clearly and at a moderate pace
4. Click the stop icon (previously the microphone) when you're done
5. Review the transcribed text and edit if necessary
6. Press Enter or click "Send" to submit

> Note: Voice recognition works best in a quiet environment. Not all browsers support voice recognition equally.

## Managing Your Conversation

### Viewing Responses

- Responses appear in the conversation display area
- Code blocks include syntax highlighting and a copy button
- Long responses may require scrolling

### Saving Important Responses

1. When you receive a useful response, click the bookmark/save icon
2. The response will be saved to your browser's local storage
3. Saved responses can be accessed in future sessions

### Copying Responses

1. Click the copy icon next to any AI response
2. The response will be copied to your clipboard
3. You can now paste it in another application

### Exporting Your Conversation

1. To save your entire conversation, click the "Export Chat" button
2. The conversation will be saved as a text file
3. The file will download automatically
4. The download includes timestamps and all messages

### Clearing Your Conversation

1. To start a new conversation, click the "Clear Chat" button
2. Confirm the action when prompted
3. Your conversation history will be cleared
4. A welcome message will appear

## Customizing the Experience

### Switching Themes

1. Click the sun/moon icon in the top right corner
2. The theme will toggle between dark and light modes
3. Your preference is saved for future sessions

### Adjusting the Model

1. Click the settings icon (⚙️)
2. Select a different model from the dropdown:
   - **Gemini 1.5 Flash**: Good balance of speed and quality (default)
   - **Gemini 1.5 Pro**: Higher quality but may be slower
   - **Gemini 1.5 Flash-8B**: Fastest responses, but may be less capable
3. Click "Save Settings"

## Troubleshooting

### API Key Issues

If you see an error about your API key:

1. Check that you've entered it correctly in settings
2. Ensure your key is active in Google AI Studio
3. Try generating a new key if problems persist

### Slow Responses

If responses are taking too long:

1. Try switching to a faster model (Flash-8B)
2. Check your internet connection
3. Keep prompts concise
4. Avoid very complex requests

### Image Upload Problems

If you're having trouble with image uploads:

1. Ensure the file is JPG or PNG format
2. Keep file sizes under 10MB
3. Try a different image
4. Check that your browser supports the File API

### Voice Recognition Issues

If voice recognition isn't working:

1. Use Google Chrome (best support)
2. Ensure your microphone is working
3. Grant microphone permissions when prompted
4. Speak clearly and not too quickly
5. Try in a quieter environment

## Privacy Information

- Your conversations are stored only in your browser's localStorage
- Images are processed locally before being sent to the API
- Your API key is stored locally in your browser
- No conversation data is retained on servers

## Keyboard Shortcuts

- **Enter**: Send message (without Shift)
- **Shift+Enter**: Add a new line without sending
- **Tab+Enter**: Navigate interface

## Getting Help

If you encounter any issues not covered in this guide, please:

1. Check the GitHub repository for known issues
2. Join our community forum at [example.com/forum](https://example.com/forum)
3. Create a new issue on the project repository

Enjoy using the Gemini AI Assistant!
