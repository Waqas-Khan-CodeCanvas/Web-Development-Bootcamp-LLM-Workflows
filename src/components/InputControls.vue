<template>
  <div>
    <div class="flex space-x-2 mb-2">
      <button
        @click="switchMode('text')"
        :class="[
          'mode-btn px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300',
          currentMode === 'text'
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
        ]"
      >
        <i class="fas fa-comment mr-2"></i>Text
      </button>
      <button
        @click="switchMode('image')"
        :class="[
          'mode-btn px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300',
          currentMode === 'image'
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
        ]"
      >
        <i class="fas fa-image mr-2"></i>Image
      </button>
    </div>

    <!-- Text input -->
    <div v-show="currentMode === 'text'">
      <div class="relative">
        <textarea
          v-model="textPrompt"
          class="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows="4"
          placeholder="Ask me anything..."
          @keydown.enter.prevent="submitIfNotShiftKey"
        ></textarea>
        <button
          @click="startSpeechRecognition('text')"
          :class="[
            'absolute bottom-3 right-3 p-2 rounded-full transition-colors',
            isRecording && recordingFor === 'text'
              ? 'bg-red-500 animate-pulse'
              : 'bg-slate-600 hover:bg-slate-500 hoverable-button',
          ]"
        >
          <i
            :class="[
              'fas',
              isRecording && recordingFor === 'text'
                ? 'fa-stop'
                : 'fa-microphone',
            ]"
          ></i>
        </button>
      </div>
      <div class="flex justify-end mt-1">
        <span class="text-xs text-slate-400"
          >{{ textCharCount }} characters (~
          {{ Math.round(textCharCount / 4) }} tokens)</span
        >
      </div>
    </div>

    <!-- Image input -->
    <div v-show="currentMode === 'image'">
      <div class="flex items-center mb-4">
        <div v-if="imagePreview" class="mr-4">
          <div class="relative">
            <img
              :src="imagePreview"
              class="w-24 h-24 object-cover rounded-lg border border-slate-600 shadow-lg"
              alt="Preview"
            />
            <button
              @click="clearImage"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hoverable-button"
              title="Remove image"
            >
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
        <label class="flex-1 cursor-pointer">
          <div
            class="bg-slate-700/50 border border-dashed border-slate-600 rounded-lg p-6 text-center transition-all duration-300 hover:bg-slate-700/80 hover:border-purple-500"
          >
            <i
              class="fas fa-cloud-upload-alt text-2xl mb-2 text-purple-500"
            ></i>
            <p class="text-slate-300">Click to upload an image</p>
            <p class="text-xs text-slate-400 mt-1">
              Supported formats: JPG, PNG
            </p>
            <input
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleImageUpload"
            />
          </div>
        </label>
      </div>
      <div class="relative">
        <textarea
          v-model="imagePrompt"
          class="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows="2"
          placeholder="What would you like to know about this image?"
          @keydown.enter.prevent="submitIfNotShiftKey"
        ></textarea>
        <button
          @click="startSpeechRecognition('image')"
          :class="[
            'absolute bottom-3 right-3 p-2 rounded-full transition-colors',
            isRecording && recordingFor === 'image'
              ? 'bg-red-500 animate-pulse'
              : 'bg-slate-600 hover:bg-slate-500 hoverable-button',
          ]"
        >
          <i
            :class="[
              'fas',
              isRecording && recordingFor === 'image'
                ? 'fa-stop'
                : 'fa-microphone',
            ]"
          ></i>
        </button>
      </div>
      <div class="flex justify-end mt-1">
        <span class="text-xs text-slate-400"
          >{{ imageCharCount }} characters (~
          {{ Math.round(imageCharCount / 4) }} tokens)</span
        >
      </div>
    </div>

    <div class="flex justify-end mt-4">
      <button
        @click="submitPrompt"
        :disabled="isProcessing"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all flex items-center',
          isProcessing
            ? 'opacity-75 cursor-not-allowed bg-slate-700'
            : 'primary-button hoverable-button',
        ]"
      >
        <i class="fas fa-paper-plane mr-2"></i>
        <span v-if="isProcessing" class="flex items-center">
          Processing<span class="typing-indicator ml-1"
            ><span></span><span></span><span></span
          ></span>
        </span>
        <span v-else>Send</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  name: "InputControls",
  props: {
    currentMode: {
      type: String,
      required: true,
    },
    isProcessing: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["switch-mode", "handle-submit"],
  setup(props, { emit }) {
    const textPrompt = ref("");
    const imagePrompt = ref("");
    const imagePreview = ref("");
    const imageData = ref(null);
    const isRecording = ref(false);
    const recordingFor = ref(null);
    let recognition = null;

    // Character counters
    const textCharCount = computed(() => textPrompt.value.length);
    const imageCharCount = computed(() => imagePrompt.value.length);

    const switchMode = (mode) => {
      emit("switch-mode", mode);
    };

    const submitPrompt = () => {
      if (props.isProcessing) return;

      const data = {
        prompt:
          props.currentMode === "text"
            ? textPrompt.value.trim()
            : imagePrompt.value.trim(),
        isImagePrompt: props.currentMode === "image",
        imageData: imageData.value,
      };

      if (data.prompt) {
        emit("handle-submit", data);

        // Clear inputs after submission
        if (props.currentMode === "text") {
          textPrompt.value = "";
        } else {
          imagePrompt.value = "";
        }
      }
    };

    const submitIfNotShiftKey = (e) => {
      if (!e.shiftKey) {
        submitPrompt();
      }
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.match("image.*")) {
        // Show an error (we'll emit an event to parent for this)
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.value = e.target.result;
        imageData.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const startSpeechRecognition = (type) => {
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        alert("Speech recognition is not supported in your browser");
        return;
      }

      if (isRecording.value) {
        stopSpeechRecognition();
        return;
      }

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      // Update UI to show recording status
      isRecording.value = true;
      recordingFor.value = type;

      let finalTranscript =
        type === "text" ? textPrompt.value : imagePrompt.value;

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

        if (type === "text") {
          textPrompt.value = finalTranscript + interimTranscript;
        } else {
          imagePrompt.value = finalTranscript + interimTranscript;
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopSpeechRecognition();
      };

      recognition.onend = () => {
        stopSpeechRecognition();
      };

      recognition.start();
    };

    const stopSpeechRecognition = () => {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }

      isRecording.value = false;
      recordingFor.value = null;
    };

    const clearImage = () => {
      imagePreview.value = "";
      imageData.value = null;
    };

    // Clean up resources when component is unmounted
    const cleanUp = () => {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
    };

    return {
      textPrompt,
      imagePrompt,
      imagePreview,
      textCharCount,
      imageCharCount,
      isRecording,
      recordingFor,
      switchMode,
      submitPrompt,
      submitIfNotShiftKey,
      handleImageUpload,
      startSpeechRecognition,
      cleanUp,
      clearImage,
    };
  },
  unmounted() {
    this.cleanUp();
  },
};
</script>
