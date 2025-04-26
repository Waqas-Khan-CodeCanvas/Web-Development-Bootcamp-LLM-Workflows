<template>
  <div class="min-h-screen" :class="isDarkTheme ? 'dark-theme' : 'light-theme'">
    <!-- Navbar -->
    <navbar
      :isDarkTheme="isDarkTheme"
      @toggle-theme="toggleTheme"
      @open-settings="openSettings"
    />

    <div class="container mx-auto px-4 pt-20 pb-8">
      <!-- Header (keeping for backward compatibility, could be removed later) -->
      <app-header
        :isDarkTheme="isDarkTheme"
        @toggle-theme="toggleTheme"
        class="hidden"
      />

      <!-- Title section below navbar -->
      <div class="text-center mb-8 animate-fadeIn">
        <h1 class="text-4xl font-bold gradient-text">AI Insight Assistant</h1>
        <p class="text-slate-400 mt-2">Powered by Gemini</p>
      </div>

      <main class="max-w-4xl mx-auto">
        <div
          class="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700 gradient-border"
        >
          <!-- Input Controls -->
          <div class="mb-8">
            <input-controls
              :currentMode="currentMode"
              :isProcessing="isProcessing"
              @switch-mode="switchMode"
              @handle-submit="handleSubmit"
            />
          </div>

          <!-- Conversation Display -->
          <conversation-display
            ref="conversationDisplay"
            :messages="conversationHistory"
          />

          <!-- History Control Buttons -->
          <div class="mt-4 flex space-x-2 justify-end">
            <button
              @click="exportConversationHistory"
              class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center hoverable-button"
            >
              <i class="fas fa-download mr-2"></i>Export Chat
            </button>
            <button
              @click="clearConversationHistory"
              class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center hoverable-button"
            >
              <i class="fas fa-trash mr-2"></i>Clear Chat
            </button>
          </div>
        </div>

        <div class="mt-8 text-center text-slate-400 text-sm">
          <p>This is a demo project using the Gemini API.</p>
          <p v-if="!settings.apiKey">
            Please add your API key in the settings to enable full
            functionality.
          </p>
        </div>

        <div class="fixed bottom-4 right-4">
          <button
            @click="openSettings"
            class="bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 hoverable-button"
          >
            <i class="fas fa-cog text-white"></i>
          </button>
        </div>
      </main>
    </div>

    <!-- Settings Modal -->
    <settings-modal
      :show="showSettingsModal"
      :settings="settings"
      @close="closeSettings"
      @save="saveSettings"
    />

    <!-- Toast Notification -->
    <toast-notification
      v-if="toastMessage"
      :message="toastMessage"
      @close="toastMessage = ''"
    />

    <!-- Decorative elements -->
    <div
      class="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]"
    >
      <!-- Blobs -->
      <div
        class="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-float-slow"
      ></div>
      <div
        class="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl animate-float-medium"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl animate-float-fast"
      ></div>
    </div>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import InputControls from "./components/InputControls.vue";
import ConversationDisplay from "./components/ConversationDisplay.vue";
import SettingsModal from "./components/SettingsModal.vue";
import ToastNotification from "./components/ToastNotification.vue";
import Navbar from "./components/Navbar.vue";
import { ref, reactive, computed, onMounted, nextTick } from "vue";

export default {
  name: "App",
  components: {
    AppHeader,
    InputControls,
    ConversationDisplay,
    SettingsModal,
    ToastNotification,
    Navbar,
  },
  setup() {
    // State
    const currentMode = ref("text");
    const isProcessing = ref(false);
    const selectedImage = ref(null);
    const isDarkTheme = ref(localStorage.getItem("theme") !== "light");
    const conversationHistory = ref([]);
    const showSettingsModal = ref(false);
    const toastMessage = ref("");
    const conversationDisplay = ref(null);

    const settings = reactive({
      apiKey:
        localStorage.getItem("gemini-api-key") ||
        "AIzaSyD6phy74bsjc3ShcS6aQ5lajcymyUDtkJI",
      model: localStorage.getItem("gemini-model") || "gemini-1.5-flash",
    });

    // Methods
    onMounted(() => {
      // Check if API key is not in localStorage but available in settings
      if (!localStorage.getItem("gemini-api-key") && settings.apiKey) {
        localStorage.setItem("gemini-api-key", settings.apiKey);
        // Show welcome message that API key has been added
        setTimeout(() => {
          addResponseMessage(
            "Your Gemini API key has been automatically added to the settings. You can start using the assistant right away!"
          );
        }, 500);
      }

      // Apply current theme
      applyTheme();

      // Load conversation history
      loadConversationHistory();
    });

    const applyTheme = () => {
      if (isDarkTheme.value) {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
      } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
      }
    };

    const toggleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
      applyTheme();
      localStorage.setItem("theme", isDarkTheme.value ? "dark" : "light");
    };

    const switchMode = (mode) => {
      currentMode.value = mode;
    };

    const openSettings = () => {
      showSettingsModal.value = true;
    };

    const closeSettings = () => {
      showSettingsModal.value = false;
    };

    const saveSettings = (newSettings) => {
      settings.apiKey = newSettings.apiKey;
      settings.model = newSettings.model;

      // Save to localStorage
      localStorage.setItem("gemini-api-key", settings.apiKey);
      localStorage.setItem("gemini-model", settings.model);

      showToast("Settings saved successfully");
      closeSettings();
    };

    const showToast = (message) => {
      toastMessage.value = message;
      setTimeout(() => {
        toastMessage.value = "";
      }, 3000);
    };

    const handleSubmit = async (data) => {
      // Validate API key is present
      if (!settings.apiKey) {
        addResponseMessage(
          "Please add your Gemini API key in the settings to use this feature.",
          "error"
        );
        openSettings();
        return;
      }

      const { prompt, isImagePrompt, imageData } = data;
      if (!prompt) {
        showToast(
          isImagePrompt
            ? "Please enter a prompt for the image"
            : "Please enter a prompt"
        );
        return;
      }

      if (isImagePrompt && !imageData) {
        showToast("Please upload an image");
        return;
      }

      // Add user message to conversation
      addUserMessage(prompt);

      // Set processing state
      isProcessing.value = true;

      try {
        let response;

        if (isImagePrompt) {
          // For image prompts, we'll use gemini-1.5-flash which supports multimodal inputs
          response = await processImagePrompt(prompt, imageData);
        } else {
          response = await processTextPrompt(prompt);
        }

        // Add AI response
        addResponseMessage(response);
      } catch (error) {
        console.error("Error:", error);
        addResponseMessage(
          "Sorry, there was an error processing your request. Please try again later.",
          "error"
        );
      } finally {
        // Reset processing state
        isProcessing.value = false;
      }
    };

    const processTextPrompt = async (prompt) => {
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
    };

    const processImagePrompt = async (prompt, imageData) => {
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
    };

    const formatResponse = (text) => {
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
    };

    const loadConversationHistory = () => {
      const storedHistory = localStorage.getItem("conversation-history");

      if (storedHistory) {
        try {
          conversationHistory.value = JSON.parse(storedHistory);
        } catch (error) {
          console.error("Error loading conversation history:", error);
          // If there's an error, clear the corrupted history
          localStorage.removeItem("conversation-history");
          conversationHistory.value = [];
        }
      }
    };

    const saveConversationHistory = () => {
      const maxMessages = 100; // Limit the number of stored messages

      // If we have too many messages, trim the history
      if (conversationHistory.value.length > maxMessages) {
        conversationHistory.value = conversationHistory.value.slice(
          -maxMessages
        );
      }

      localStorage.setItem(
        "conversation-history",
        JSON.stringify(conversationHistory.value)
      );
    };

    const addUserMessage = (message) => {
      conversationHistory.value.push({
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      });

      // Save updated history
      saveConversationHistory();

      // Scroll to bottom after next DOM update
      nextTick(() => {
        conversationDisplay.value.scrollToBottom();
      });
    };

    const addResponseMessage = (message, type = "success") => {
      if (type !== "error") {
        // Add to conversation history
        conversationHistory.value.push({
          role: "assistant",
          content: message,
          timestamp: new Date().toISOString(),
        });

        // Save updated history
        saveConversationHistory();
      }

      // Scroll to bottom after next DOM update
      nextTick(() => {
        conversationDisplay.value.scrollToBottom();
      });

      return message;
    };

    const exportConversationHistory = () => {
      if (conversationHistory.value.length === 0) {
        showToast("No conversation to export");
        return;
      }

      let exportText = "# Gemini AI Conversation\n\n";

      conversationHistory.value.forEach((message) => {
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
    };

    const clearConversationHistory = () => {
      if (confirm("Are you sure you want to clear the conversation history?")) {
        conversationHistory.value = [];
        localStorage.removeItem("conversation-history");

        // Add welcome message
        addResponseMessage(
          "Conversation history cleared. Hello! I'm your AI assistant powered by Gemini. How can I help you today?"
        );

        showToast("Conversation history cleared");
      }
    };

    // Return values and methods for template
    return {
      currentMode,
      isProcessing,
      selectedImage,
      isDarkTheme,
      conversationHistory,
      settings,
      showSettingsModal,
      toastMessage,
      conversationDisplay,

      switchMode,
      toggleTheme,
      openSettings,
      closeSettings,
      saveSettings,
      handleSubmit,
      showToast,
      exportConversationHistory,
      clearConversationHistory,
    };
  },
};
</script>

<style>
@import "./assets/styles.css";

/* Animation for decorative blobs */
@keyframes float-slow {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 20px);
  }
}

@keyframes float-medium {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes float-fast {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(15px, 15px);
  }
}

.animate-float-slow {
  animation: float-slow 15s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 12s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 8s ease-in-out infinite;
}
</style>
