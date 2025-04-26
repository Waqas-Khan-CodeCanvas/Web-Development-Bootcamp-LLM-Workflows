<template>
  <header class="mb-10">
    <div class="flex justify-between items-center mb-2">
      <div class="flex-1"></div>
      <h1
        class="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600 flex-2"
      >
        AI Insight Assistant
      </h1>
      <div class="flex-1 flex justify-end">
        <button
          @click="$emit('toggle-theme')"
          class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <i class="fas fa-sun" v-if="!isDarkTheme"></i>
          <i class="fas fa-moon" v-else></i>
        </button>
      </div>
    </div>
    <p class="text-center text-slate-300 mt-2">Powered by Gemini AI</p>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  props: {
    isDarkTheme: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["toggle-theme"],
};
</script>
