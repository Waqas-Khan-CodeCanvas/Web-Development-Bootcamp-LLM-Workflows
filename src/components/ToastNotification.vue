<template>
  <transition name="toast">
    <div
      class="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
      :class="
        type === 'success'
          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
          : 'bg-red-500 text-white'
      "
    >
      <i
        :class="[
          'fas',
          'mr-2',
          type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle',
        ]"
      ></i>
      <span>{{ message }}</span>
      <button @click="$emit('close')" class="ml-3 hover:text-slate-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ToastNotification",
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success",
      validator: (value) => ["success", "error"].includes(value),
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    setTimeout(() => {
      emit("close");
    }, 3000);
  },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
