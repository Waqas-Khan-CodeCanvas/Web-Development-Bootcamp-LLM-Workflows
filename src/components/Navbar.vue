<template>
  <nav
    class="backdrop-blur-md bg-slate-800/60 border-b border-slate-700 fixed top-0 left-0 right-0 z-50"
  >
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo & Brand -->
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center floating"
          >
            <i class="fas fa-robot text-white"></i>
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold gradient-text">
              AI Insight Assistant
            </h1>
            <p class="text-xs text-slate-400">Powered by Gemini</p>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="hidden md:flex items-center space-x-6">
          <a
            href="#"
            class="text-slate-300 hover:text-white flex items-center space-x-1 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-slate-700/50"
          >
            <i class="fas fa-book"></i>
            <span>Documentation</span>
          </a>
          <a
            href="https://ai.google.dev/"
            target="_blank"
            class="text-slate-300 hover:text-white flex items-center space-x-1 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-slate-700/50"
          >
            <i class="fas fa-external-link-alt"></i>
            <span>Google AI</span>
          </a>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button
            @click="$emit('toggle-theme')"
            class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors hoverable-button"
            :title="
              isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'
            "
          >
            <i class="fas fa-sun" v-if="!isDarkTheme"></i>
            <i class="fas fa-moon" v-else></i>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors hoverable-button md:hidden"
          >
            <i class="fas fa-bars" v-if="!mobileMenuOpen"></i>
            <i class="fas fa-times" v-else></i>
          </button>

          <!-- Settings Button (Desktop) -->
          <button
            @click="$emit('open-settings')"
            class="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white hoverable-button hidden md:flex"
            title="Settings"
          >
            <i class="fas fa-cog"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-slate-800/95 animate-fadeIn">
      <div class="container mx-auto px-4 py-3 space-y-2">
        <a
          href="#"
          class="block px-4 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <i class="fas fa-book mr-2"></i>Documentation
        </a>
        <a
          href="https://ai.google.dev/"
          target="_blank"
          class="block px-4 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <i class="fas fa-external-link-alt mr-2"></i>Google AI
        </a>
        <div class="border-t border-slate-700 my-2"></div>
        <button
          @click="
            $emit('open-settings');
            mobileMenuOpen = false;
          "
          class="w-full text-left px-4 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <i class="fas fa-cog mr-2"></i>Settings
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Navbar",
  props: {
    isDarkTheme: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const mobileMenuOpen = ref(false);

    return {
      mobileMenuOpen,
    };
  },
  emits: ["toggle-theme", "open-settings"],
};
</script>

<style scoped>
/* Subtle glow effect on hover */
a:hover,
button:hover {
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
</style>
