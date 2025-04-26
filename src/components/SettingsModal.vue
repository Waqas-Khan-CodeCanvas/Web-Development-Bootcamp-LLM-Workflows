<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      @click="$emit('close')"
    >
      <div
        class="bg-slate-800/90 rounded-xl p-6 w-full max-w-md border gradient-border shadow-2xl"
        @click.stop
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold gradient-text">Settings</h2>
          <button
            @click="$emit('close')"
            class="text-slate-400 hover:text-white hoverable-button p-2 rounded-full hover:bg-slate-700/50 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-6">
          <div>
            <label
              for="api-key"
              class="block text-sm font-medium text-slate-300 mb-1"
              >Gemini API Key</label
            >
            <div class="relative">
              <input
                v-model="localSettings.apiKey"
                :type="showApiKey ? 'text' : 'password'"
                id="api-key"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your API key"
              />
              <button
                @click="showApiKey = !showApiKey"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                type="button"
              >
                <i :class="['fas', showApiKey ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
            <div class="mt-1 text-xs text-slate-400 flex items-center">
              <i class="fas fa-info-circle mr-1"></i>
              Get your key from
              <a
                href="https://ai.google.dev"
                target="_blank"
                class="text-purple-400 hover:text-purple-300 underline ml-1"
                >Google AI Studio</a
              >
            </div>
          </div>

          <div>
            <label
              for="model-select"
              class="block text-sm font-medium text-slate-300 mb-1"
              >Model</label
            >
            <select
              v-model="localSettings.model"
              id="model-select"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8 appearance-none"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Free)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash-8b">
                Gemini 1.5 Flash-8B (Fastest)
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <i class="fas fa-chevron-down text-slate-400"></i>
            </div>
          </div>

          <div class="pt-4">
            <button
              @click="saveSettings"
              class="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-3 rounded-lg font-medium hoverable-button transition-all hover:shadow-lg hover:shadow-purple-500/20"
            >
              <i class="fas fa-save mr-2"></i>Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, reactive, watch } from "vue";

export default {
  name: "SettingsModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
  },
  emits: ["close", "save"],
  setup(props, { emit }) {
    const localSettings = reactive({
      apiKey: "",
      model: "gemini-1.5-flash",
    });

    const showApiKey = ref(false);

    // Update local settings when props change
    watch(
      () => props.settings,
      (newSettings) => {
        localSettings.apiKey = newSettings.apiKey;
        localSettings.model = newSettings.model;
      },
      { immediate: true }
    );

    // Also update when show changes to true (to ensure latest values)
    watch(
      () => props.show,
      (isShown) => {
        if (isShown) {
          localSettings.apiKey = props.settings.apiKey;
          localSettings.model = props.settings.model;
          showApiKey.value = false; // Reset visibility when opening
        }
      }
    );

    const saveSettings = () => {
      emit("save", {
        apiKey: localSettings.apiKey,
        model: localSettings.model,
      });
    };

    return {
      localSettings,
      saveSettings,
      showApiKey,
    };
  },
};
</script>
