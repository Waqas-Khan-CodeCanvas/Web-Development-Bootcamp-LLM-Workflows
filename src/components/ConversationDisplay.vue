<template>
  <div ref="container" class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
    <!-- Empty state message if no messages -->
    <div
      v-if="messages.length === 0"
      class="response-card bg-slate-700/30 p-5 rounded-lg border border-slate-700 glass-card"
    >
      <div class="flex items-start">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 floating"
        >
          <i class="fas fa-robot"></i>
        </div>
        <div class="ml-4 flex-1">
          <p class="text-slate-300">
            Hello! I'm your AI assistant powered by Gemini. I can help answer
            questions, generate content, or analyze images. How can I assist you
            today?
          </p>
        </div>
      </div>
    </div>

    <!-- Conversation messages -->
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="response-card bg-slate-700/30 p-5 rounded-lg border border-slate-700"
      :class="{
        'animate-fadeIn': true,
        'glass-card': message.role === 'assistant',
      }"
    >
      <div class="flex items-start">
        <!-- User message -->
        <template v-if="message.role === 'user'">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg"
          >
            <i class="fas fa-user"></i>
          </div>
          <div class="ml-4 flex-1">
            <div class="flex items-center mb-1">
              <span class="font-medium text-white">You</span>
              <span class="text-xs text-slate-400 ml-2">{{
                formatTime(message.timestamp)
              }}</span>
            </div>
            <p class="text-white">{{ message.content }}</p>
          </div>
        </template>

        <!-- AI message -->
        <template v-else>
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg"
          >
            <i class="fas fa-robot"></i>
          </div>
          <div class="ml-4 flex-1">
            <div class="flex items-center mb-1">
              <span class="font-medium gradient-text">AI Assistant</span>
              <span class="text-xs text-slate-400 ml-2">{{
                formatTime(message.timestamp)
              }}</span>
            </div>
            <div class="text-slate-300" v-html="message.content"></div>
            <div class="flex mt-2 space-x-2">
              <button
                @click="toggleBookmark(index)"
                class="bookmark-btn text-xs text-slate-400 hover:text-slate-300 p-1 rounded transition-colors hover:bg-slate-700/50"
                :class="{ 'text-purple-400': isBookmarked(message.content) }"
              >
                <i
                  :class="[
                    'far',
                    isBookmarked(message.content)
                      ? 'fas fa-bookmark'
                      : 'far fa-bookmark',
                  ]"
                ></i>
                {{ isBookmarked(message.content) ? "Saved" : "Save" }}
              </button>
              <button
                @click="copyToClipboard(message.content)"
                class="text-xs text-slate-400 hover:text-slate-300 p-1 rounded transition-colors hover:bg-slate-700/50"
              >
                <i class="far fa-copy"></i> Copy
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Typing indicator (visible when processing) -->
    <div
      v-if="isProcessing"
      class="response-card bg-slate-700/30 p-5 rounded-lg border border-slate-700 glass-card animate-fadeIn"
    >
      <div class="flex items-start">
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg"
        >
          <i class="fas fa-robot"></i>
        </div>
        <div class="ml-4 flex-1">
          <div class="flex items-center mb-1">
            <span class="font-medium gradient-text">AI Assistant</span>
          </div>
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, onMounted } from "vue";

export default {
  name: "ConversationDisplay",
  props: {
    messages: {
      type: Array,
      required: true,
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const container = ref(null);
    const bookmarks = ref([]);

    onMounted(() => {
      // Load bookmarks from localStorage
      try {
        const savedBookmarks = localStorage.getItem("bookmarked-responses");
        if (savedBookmarks) {
          bookmarks.value = JSON.parse(savedBookmarks);
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }

      // Scroll to bottom on initial load
      scrollToBottom();
    });

    // Scroll to bottom when messages change
    watch(
      () => props.messages.length,
      () => {
        nextTick(scrollToBottom);
      }
    );

    const scrollToBottom = () => {
      if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
      }
    };

    const isBookmarked = (content) => {
      return bookmarks.value.some((bookmark) => bookmark.content === content);
    };

    const toggleBookmark = (index) => {
      const message = props.messages[index];

      if (isBookmarked(message.content)) {
        // Remove bookmark
        const bookmarkIndex = bookmarks.value.findIndex(
          (b) => b.content === message.content
        );
        if (bookmarkIndex !== -1) {
          bookmarks.value.splice(bookmarkIndex, 1);
        }
      } else {
        // Add bookmark
        bookmarks.value.push({
          content: message.content,
          timestamp: new Date().toISOString(),
        });
      }

      // Save bookmarks to localStorage
      localStorage.setItem(
        "bookmarked-responses",
        JSON.stringify(bookmarks.value)
      );
    };

    const copyToClipboard = (text) => {
      // Create a temporary element to strip HTML tags
      const tempElement = document.createElement("div");
      tempElement.innerHTML = text;
      const plainText = tempElement.textContent || tempElement.innerText || "";

      navigator.clipboard
        .writeText(plainText)
        .then(() => {
          // Show toast notification (we could emit an event to parent)
          console.log("Copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return "";

      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return {
      container,
      scrollToBottom,
      isBookmarked,
      toggleBookmark,
      copyToClipboard,
      formatTime,
    };
  },
};
</script>
