# Gemini API Reference Guide

This document provides detailed information about the Google Gemini API used in the Gemini AI Assistant application. It covers API endpoints, parameters, and implementation details.

## API Overview

The Gemini AI Assistant uses Google's Generative Language API, specifically the Gemini 1.5 models. These models support both text-only prompts and multimodal prompts (text + images).

## API Key Setup

To use the Gemini API, you need to:

1. Visit [Google AI Studio](https://ai.google.dev/) and sign in with your Google account
2. Create an API key from the API Keys section
3. Add the key to the Gemini AI Assistant application settings
4. Keep your API key secure and never share it publicly

## Available Models

The application supports multiple Gemini models:

| Model                 | Description                     | Best For                     |
| --------------------- | ------------------------------- | ---------------------------- |
| `gemini-1.5-flash`    | Fast, efficient model (default) | General text & image tasks   |
| `gemini-1.5-pro`      | More capable but slower         | Complex reasoning tasks      |
| `gemini-1.5-flash-8b` | Fastest, smaller model          | Quick responses, basic tasks |

## API Endpoints

### Text Generation

**Endpoint:** `https://generativelanguage.googleapis.com/v1/models/MODEL_NAME:generateContent`

Where `MODEL_NAME` is one of the models listed above (e.g., `gemini-1.5-flash`).

**Request Format:**

```javascript
fetch(
  `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Your prompt here",
            },
          ],
        },
      ],
    }),
  }
);
```

**Response Format:**

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Generated response text here"
          }
        ]
      }
    }
  ]
}
```

### Multimodal Generation (Text + Image)

**Request Format:**

```javascript
fetch(
  `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Your prompt about the image",
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: "BASE64_ENCODED_IMAGE_DATA",
              },
            },
          ],
        },
      ],
    }),
  }
);
```

## Request Parameters

### Core Parameters

| Parameter     | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| `contents`    | Array  | Array of content parts for the prompt           |
| `parts`       | Array  | Array of content parts (text, image)            |
| `text`        | String | The text prompt                                 |
| `inline_data` | Object | Contains image data (for multimodal prompts)    |
| `mime_type`   | String | The MIME type of the image (e.g., "image/jpeg") |
| `data`        | String | Base64-encoded image data                       |

### Optional Parameters

These parameters can be added to customize generation:

| Parameter         | Type    | Description                   |
| ----------------- | ------- | ----------------------------- |
| `temperature`     | Float   | Controls randomness (0.0-1.0) |
| `maxOutputTokens` | Integer | Maximum tokens to generate    |
| `topK`            | Integer | Limits vocabulary selection   |
| `topP`            | Float   | Nucleus sampling parameter    |

Example with optional parameters:

```javascript
body: JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
    topK: 40,
    topP: 0.95,
  },
});
```

## Error Handling

The API may return error responses. Common errors include:

| Error Code | Description       | Solution                              |
| ---------- | ----------------- | ------------------------------------- |
| 400        | Bad Request       | Check request format and parameters   |
| 401        | Unauthorized      | Check your API key                    |
| 403        | Forbidden         | Ensure API key has proper permissions |
| 429        | Too Many Requests | Implement rate limiting in your app   |
| 500        | Server Error      | Retry with exponential backoff        |

Example error response:

```json
{
  "error": {
    "code": 400,
    "message": "Invalid argument",
    "status": "INVALID_ARGUMENT"
  }
}
```

## Image Handling

When uploading images:

1. Convert the image to Base64 encoding
2. Remove the prefix (e.g., "data:image/jpeg;base64,")
3. Keep images under 10MB
4. Supported formats: JPEG, PNG, WEBP, HEIC

Example JavaScript for image processing:

```javascript
function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Get base64 data (remove prefix)
      const base64Data = e.target.result.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

## Rate Limits

- Free tier: 60 queries per minute
- Paid tier: Higher limits based on subscription

Implement proper error handling and rate limiting in your application to avoid errors.

## Implementation in the Gemini AI Assistant

The application implements the API calls in the `App.vue` component:

1. For text prompts: `processTextPrompt()` function
2. For image prompts: `processImagePrompt()` function
3. Response handling: `formatResponse()` function

## Response Formatting

The application formats Gemini's responses by:

1. Processing code blocks with syntax highlighting
2. Converting markdown-style formatting to HTML
3. Formatting lists and paragraphs
4. Making code blocks copyable

## Best Practices

1. **Safety & Policies**: Follow Google's AI principles and content policies
2. **API Key Security**: Store your API key securely, never expose in client-side code
3. **Error Handling**: Implement proper error handling and user feedback
4. **Rate Limiting**: Respect API rate limits to avoid service disruptions
5. **Timeout Handling**: Implement request timeouts (Gemini may take time for complex queries)
6. **Content Safety**: Handle potentially harmful content appropriately

## Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs/gemini_api_overview)
- [Google AI Studio](https://ai.google.dev/)
- [Gemini Responsible AI](https://ai.google.dev/responsible)
