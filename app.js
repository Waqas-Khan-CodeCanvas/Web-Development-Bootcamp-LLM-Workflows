// DOM Elements
const textModeBtn = document.getElementById("text-mode");
const imageModeBtn = document.getElementById("image-mode");
const textInputContainer = document.getElementById("text-input-container");
const imageInputContainer = document.getElementById("image-input-container");
const userInput = document.getElementById("user-input");
const imagePrompt = document.getElementById("image-prompt");
const imageUpload = document.getElementById("image-upload");
const imagePreview = document.getElementById("image-preview");
const imagePreviewContainer = document.getElementById(
  "image-preview-container"
);
const submitBtn = document.getElementById("submit-btn");
const responsesContainer = document.getElementById("responses-container");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsBtn = document.getElementById("close-settings");
const saveSettingsBtn = document.getElementById("save-settings");
const apiKeyInput = document.getElementById("api-key");
const modelSelect = document.getElementById("model-select");
const themeToggleBtn = document.getElementById("theme-toggle");
const voiceInputBtn = document.getElementById("voice-input-btn");
const imageVoiceInputBtn = document.getElementById("image-voice-input-btn");
const textCharCounter = document.getElementById("text-char-counter");
const imageCharCounter = document.getElementById("image-char-counter");

// State
let currentMode = "text";
let isProcessing = false;
let selectedImage = null;
let isDarkTheme = localStorage.getItem("theme") !== "light";
let conversationHistory = [];
let isRecording = false;
let settings = {
  apiKey:
    localStorage.getItem("gemini-api-key") ||
    "AIzaSyD6phy74bsjc3ShcS6aQ5lajcymyUDtkJI",
  model: localStorage.getItem("gemini-model") || "gemini-1.5-flash",
};

// Initialize
function init() {
  // Check if API key is not in localStorage but available in settings
  if (!localStorage.getItem("gemini-api-key") && settings.apiKey) {
    localStorage.setItem("gemini-api-key", settings.apiKey);
    // Show welcome message that API key has been added
    setTimeout(() => {
      addResponseCard(
        "Your Gemini API key has been automatically added to the settings. You can start using the assistant right away!"
      );
    }, 500);
  }

  // Load settings
  apiKeyInput.value = settings.apiKey;
  modelSelect.value = settings.model;

  // Apply current theme
  applyTheme();

  // Load conversation history
  loadConversationHistory();

  // Set event listeners
  textModeBtn.addEventListener("click", () => switchMode("text"));
  imageModeBtn.addEventListener("click", () => switchMode("image"));
  submitBtn.addEventListener("click", handleSubmit);
  settingsBtn.addEventListener("click", openSettings);
  closeSettingsBtn.addEventListener("click", closeSettings);
  saveSettingsBtn.addEventListener("click", saveSettings);
  imageUpload.addEventListener("change", handleImageUpload);
  themeToggleBtn.addEventListener("click", toggleTheme);

  // Character counter
  if (userInput && textCharCounter) {
    userInput.addEventListener("input", () =>
      updateCharCounter(userInput, textCharCounter)
    );
    // Initial update
    updateCharCounter(userInput, textCharCounter);
  }

  if (imagePrompt && imageCharCounter) {
    imagePrompt.addEventListener("input", () =>
      updateCharCounter(imagePrompt, imageCharCounter)
    );
    // Initial update
    updateCharCounter(imagePrompt, imageCharCounter);
  }

  // Voice input
  if (voiceInputBtn) {
    voiceInputBtn.addEventListener("click", () =>
      startSpeechRecognition(userInput)
    );
  }

  if (imageVoiceInputBtn) {
    imageVoiceInputBtn.addEventListener("click", () =>
      startSpeechRecognition(imagePrompt)
    );
  }

  // Add export history button event listener
  document
    .getElementById("export-history-btn")
    ?.addEventListener("click", exportConversationHistory);
  // Add clear history button event listener
  document
    .getElementById("clear-history-btn")
    ?.addEventListener("click", clearConversationHistory);

  // Handle input submission with Enter key
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  imagePrompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });
}

// Toggle between light and dark themes
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
}

// Apply the current theme
function applyTheme() {
  const darkIcon = document.getElementById("dark-icon");
  const lightIcon = document.getElementById("light-icon");

  if (isDarkTheme) {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    darkIcon.classList.remove("hidden");
    lightIcon.classList.add("hidden");
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    lightIcon.classList.remove("hidden");
    darkIcon.classList.add("hidden");
  }
}

// Switch between text and image modes
function switchMode(mode) {
  currentMode = mode;

  if (mode === "text") {
    textModeBtn.classList.add("bg-purple-600");
    textModeBtn.classList.remove("bg-slate-700");
    imageModeBtn.classList.add("bg-slate-700");
    imageModeBtn.classList.remove("bg-purple-600");

    textInputContainer.classList.remove("hidden");
    imageInputContainer.classList.add("hidden");
  } else {
    imageModeBtn.classList.add("bg-purple-600");
    imageModeBtn.classList.remove("bg-slate-700");
    textModeBtn.classList.add("bg-slate-700");
    textModeBtn.classList.remove("bg-purple-600");

    textInputContainer.classList.add("hidden");
    imageInputContainer.classList.remove("hidden");
  }
}

// Handle image upload
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.match("image.*")) {
    addResponseCard("Please upload an image file (JPG, PNG).", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    imagePreview.src = e.target.result;
    imagePreviewContainer.classList.remove("hidden");
    selectedImage = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Submit user input to Gemini API
async function handleSubmit() {
  // Validate API key is present
  if (!settings.apiKey) {
    addResponseCard(
      "Please add your Gemini API key in the settings to use this feature.",
      "error"
    );
    openSettings();
    return;
  }

  let prompt;
  let isImagePrompt = false;

  if (currentMode === "text") {
    prompt = userInput.value.trim();
    if (!prompt) {
      showToast("Please enter a prompt");
      return;
    }
  } else {
    prompt = imagePrompt.value.trim();
    if (!prompt) {
      showToast("Please enter a prompt for the image");
      return;
    }

    if (!selectedImage) {
      showToast("Please upload an image");
      return;
    }

    isImagePrompt = true;
  }

  // Show user message
  addUserMessage(prompt);

  // Clear input fields
  if (currentMode === "text") {
    userInput.value = "";
  } else {
    imagePrompt.value = "";
  }

  // Show typing indicator
  const loadingCard = addTypingIndicator();

  // Set processing state
  isProcessing = true;
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  try {
    let response;

    if (isImagePrompt) {
      // For image prompts, we'll use gemini-1.5-flash which supports multimodal inputs
      response = await processImagePrompt(prompt, selectedImage);
    } else {
      response = await processTextPrompt(prompt);
    }

    // Remove typing indicator
    loadingCard.remove();

    // Add AI response
    addResponseCard(response);
  } catch (error) {
    console.error("Error:", error);
    loadingCard.remove();
    addResponseCard(
      "Sorry, there was an error processing your request. Please try again later.",
      "error"
    );
  } finally {
    // Reset processing state
    isProcessing = false;
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
}

// Process text prompt with Gemini API
async function processTextPrompt(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${settings.apiKey}`,
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
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Unknown error occurred");
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    return formatResponse(textResponse);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Process image prompt with Gemini API
async function processImagePrompt(prompt, imageData) {
  try {
    // Process image data (remove data:image/jpeg;base64, prefix)
    const base64Image = imageData.split(",")[1];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${settings.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Unknown error occurred");
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    return formatResponse(textResponse);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Format response with markdown-like syntax
function formatResponse(text) {
  // Format code blocks
  text = text.replace(/```([\s\S]*?)```/g, function (match, code) {
    const hasLanguage =
      code.split("\n")[0].trim().length > 0 &&
      !code.split("\n")[0].includes(" ");
    let language = "";

    if (hasLanguage) {
      language = code.split("\n")[0].trim();
      code = code.split("\n").slice(1).join("\n");
    }

    return `<div class="code-block">
                  <div class="code-header">
                    <span class="code-language">${language || "code"}</span>
                    <button class="copy-button" onclick="copyCode(this)">
                      <i class="fas fa-copy"></i> Copy
                    </button>
                  </div>
                  <div class="code-content">${code}</div>
                </div>`;
  });

  // Format bold text
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Format italic text
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Format lists
  text = text.replace(/^- (.*)/gm, "<li>$1</li>");
  text = text.replace(/<li>.*<\/li>/gs, "<ul>$&</ul>");

  // Format paragraphs
  text = text.replace(/(.+?)(\n\n|$)/g, "<p>$1</p>");

  return text;
}

// Add user message to the chat
function addUserMessage(message) {
  const userCard = document.createElement("div");
  userCard.className =
    "response-card bg-slate-700/30 p-5 rounded-lg border border-slate-700";
  userCard.innerHTML = `
        <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user"></i>
            </div>
            <div class="ml-4 flex-1">
                <p class="text-white">${message}</p>
            </div>
        </div>
    `;

  responsesContainer.appendChild(userCard);
  scrollToBottom();

  // Add to conversation history
  conversationHistory.push({
    role: "user",
    content: message,
    timestamp: new Date().toISOString(),
  });

  // Save updated history
  saveConversationHistory();
}

// Add AI response card to the chat
function addResponseCard(message, type = "success") {
  const responseCard = document.createElement("div");
  responseCard.className =
    "response-card bg-slate-700/30 p-5 rounded-lg border border-slate-700";

  let icon, messageClass;
  if (type === "error") {
    icon = "fa-exclamation-circle";
    messageClass = "text-red-400";
  } else {
    icon = "fa-robot";
    messageClass = "text-slate-300";
  }

  responseCard.innerHTML = `
        <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <i class="fas ${icon}"></i>
            </div>
            <div class="ml-4 flex-1">
                <div class="${messageClass}">${message}</div>
                ${
                  type !== "error"
                    ? `
                <div class="flex mt-2 space-x-2">
                    <button class="bookmark-btn text-xs text-slate-400 hover:text-slate-300 p-1">
                        <i class="far fa-bookmark"></i> Save
                    </button>
                    <button class="copy-response-btn text-xs text-slate-400 hover:text-slate-300 p-1">
                        <i class="far fa-copy"></i> Copy
                    </button>
                </div>`
                    : ""
                }
            </div>
        </div>
    `;

  responsesContainer.appendChild(responseCard);
  scrollToBottom();

  // Add bookmark functionality
  if (type !== "error") {
    const bookmarkBtn = responseCard.querySelector(".bookmark-btn");
    const copyBtn = responseCard.querySelector(".copy-response-btn");

    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => {
        toggleBookmark(bookmarkBtn, message);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyToClipboard(message);
      });
    }
  }

  // Add global function for code copy
  window.copyCode = function (button) {
    const codeBlock = button
      .closest(".code-block")
      .querySelector(".code-content");
    const textToCopy = codeBlock.textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    });
  };

  // Only add to history if it's not an error message
  if (type !== "error") {
    // Add to conversation history
    conversationHistory.push({
      role: "assistant",
      content: message,
      timestamp: new Date().toISOString(),
    });

    // Save updated history
    saveConversationHistory();
  }

  return responseCard;
}

// Toggle bookmark for a message
function toggleBookmark(bookmarkBtn, message) {
  const isBookmarked = bookmarkBtn.querySelector("i").classList.contains("fas");
  const bookmarks = JSON.parse(
    localStorage.getItem("bookmarked-responses") || "[]"
  );

  if (isBookmarked) {
    // Remove bookmark
    bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> Save';
    bookmarkBtn.classList.remove("text-purple-400");
    bookmarkBtn.classList.add("text-slate-400");

    // Remove from bookmarks array
    const index = bookmarks.findIndex((b) => b.content === message);
    if (index !== -1) {
      bookmarks.splice(index, 1);
    }
  } else {
    // Add bookmark
    bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
    bookmarkBtn.classList.remove("text-slate-400");
    bookmarkBtn.classList.add("text-purple-400");

    // Add to bookmarks array
    bookmarks.push({
      content: message,
      timestamp: new Date().toISOString(),
    });
  }

  // Save bookmarks to localStorage
  localStorage.setItem("bookmarked-responses", JSON.stringify(bookmarks));

  showToast(
    isBookmarked ? "Response removed from bookmarks" : "Response bookmarked!"
  );
}

// Copy response to clipboard
function copyToClipboard(text) {
  // Create a temporary element to strip HTML tags
  const tempElement = document.createElement("div");
  tempElement.innerHTML = text;
  const plainText = tempElement.textContent || tempElement.innerText || "";

  navigator.clipboard
    .writeText(plainText)
    .then(() => {
      showToast("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
      showToast("Failed to copy text");
    });
}

// Add typing indicator
function addTypingIndicator() {
  const loadingCard = document.createElement("div");
  loadingCard.className =
    "response-card bg-slate-700/30 p-5 rounded-lg border border-slate-700";
  loadingCard.innerHTML = `
        <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot"></i>
            </div>
            <div class="ml-4 flex-1">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

  responsesContainer.appendChild(loadingCard);
  scrollToBottom();

  return loadingCard;
}

// Scroll to bottom of responses container
function scrollToBottom() {
  responsesContainer.scrollTop = responsesContainer.scrollHeight;
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.className =
    "fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Settings modal functions
function openSettings() {
  settingsModal.classList.remove("hidden");
}

function closeSettings() {
  settingsModal.classList.add("hidden");
}

function saveSettings() {
  settings.apiKey = apiKeyInput.value.trim();
  settings.model = modelSelect.value;

  // Save to localStorage
  localStorage.setItem("gemini-api-key", settings.apiKey);
  localStorage.setItem("gemini-model", settings.model);

  showToast("Settings saved successfully");
  closeSettings();
}

// Save conversation to localStorage
function saveConversationHistory() {
  const maxMessages = 100; // Limit the number of stored messages

  // If we have too many messages, trim the history
  if (conversationHistory.length > maxMessages) {
    conversationHistory = conversationHistory.slice(-maxMessages);
  }

  localStorage.setItem(
    "conversation-history",
    JSON.stringify(conversationHistory)
  );
}

// Load conversation from localStorage
function loadConversationHistory() {
  const storedHistory = localStorage.getItem("conversation-history");

  if (storedHistory) {
    try {
      conversationHistory = JSON.parse(storedHistory);

      // Clear existing messages in the UI
      while (responsesContainer.children.length > 0) {
        responsesContainer.removeChild(responsesContainer.lastChild);
      }

      // Restore messages to the UI
      conversationHistory.forEach((message) => {
        if (message.role === "user") {
          addUserMessage(message.content);
        } else {
          addResponseCard(message.content);
        }
      });

      // Scroll to bottom
      scrollToBottom();
    } catch (error) {
      console.error("Error loading conversation history:", error);
      // If there's an error, clear the corrupted history
      localStorage.removeItem("conversation-history");
      conversationHistory = [];
    }
  }
}

// Export conversation history as text file
function exportConversationHistory() {
  if (conversationHistory.length === 0) {
    showToast("No conversation to export");
    return;
  }

  let exportText = "# Gemini AI Conversation\n\n";

  conversationHistory.forEach((message) => {
    const role = message.role === "user" ? "You" : "AI";
    exportText += `## ${role}:\n${message.content}\n\n`;
  });

  const blob = new Blob([exportText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `gemini-conversation-${new Date()
    .toISOString()
    .slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  showToast("Conversation exported successfully");
}

// Clear conversation history
function clearConversationHistory() {
  if (confirm("Are you sure you want to clear the conversation history?")) {
    conversationHistory = [];
    localStorage.removeItem("conversation-history");

    // Clear UI
    while (responsesContainer.children.length > 0) {
      responsesContainer.removeChild(responsesContainer.lastChild);
    }

    // Add welcome message
    addResponseCard(
      "Conversation history cleared. Hello! I'm your AI assistant powered by Gemini. How can I help you today?"
    );

    showToast("Conversation history cleared");
  }
}

// Speech Recognition
function startSpeechRecognition(targetInput) {
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    showToast("Speech recognition is not supported in your browser");
    return;
  }

  if (isRecording) {
    stopSpeechRecognition();
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  // Update UI to show recording status
  isRecording = true;
  updateRecordingStatus(
    true,
    targetInput === userInput ? voiceInputBtn : imageVoiceInputBtn
  );

  let finalTranscript = targetInput.value;

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += " " + transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    targetInput.value = finalTranscript + interimTranscript;

    // Update character counter
    if (targetInput === userInput && textCharCounter) {
      updateCharCounter(userInput, textCharCounter);
    } else if (targetInput === imagePrompt && imageCharCounter) {
      updateCharCounter(imagePrompt, imageCharCounter);
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    showToast(`Error: ${event.error}`);
    stopSpeechRecognition();
  };

  recognition.onend = () => {
    stopSpeechRecognition();
  };

  window.currentRecognition = recognition;
  recognition.start();
}

function stopSpeechRecognition() {
  if (window.currentRecognition) {
    window.currentRecognition.stop();
    window.currentRecognition = null;
  }

  isRecording = false;
  updateRecordingStatus(false);
}

function updateRecordingStatus(isRecording, button = null) {
  const textBtn = voiceInputBtn;
  const imageBtn = imageVoiceInputBtn;

  if (button) {
    if (isRecording) {
      button.classList.add("bg-red-500");
      button.classList.remove("bg-slate-600");
      button.innerHTML = '<i class="fas fa-stop"></i>';
    } else {
      button.classList.remove("bg-red-500");
      button.classList.add("bg-slate-600");
      button.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  } else {
    // Reset both buttons
    if (textBtn) {
      textBtn.classList.remove("bg-red-500");
      textBtn.classList.add("bg-slate-600");
      textBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }

    if (imageBtn) {
      imageBtn.classList.remove("bg-red-500");
      imageBtn.classList.add("bg-slate-600");
      imageBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  }
}

// Update character counter
function updateCharCounter(inputElement, counterElement) {
  const count = inputElement.value.length;

  // Rough token estimation (approx 4 chars per token for English)
  const tokenEstimate = Math.round(count / 4);

  counterElement.textContent = `${count} characters (~ ${tokenEstimate} tokens)`;

  // Change color if approaching limits
  if (count > 8000) {
    counterElement.classList.add("text-amber-500");
  } else if (count > 15000) {
    counterElement.classList.remove("text-amber-500");
    counterElement.classList.add("text-red-500");
  } else {
    counterElement.classList.remove("text-amber-500", "text-red-500");
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", init);
