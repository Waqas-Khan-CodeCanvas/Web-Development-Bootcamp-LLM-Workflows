import { createApp } from "vue";
import App from "./App.vue";

// Import Font Awesome
const loadFontAwesome = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
  document.head.appendChild(link);
};

// Import Tailwind
const loadTailwind = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    script.onload = resolve;
    script.onerror = () => {
      console.error("Failed to load Tailwind CSS");
      resolve(); // Still resolve to not block app loading
    };
    document.head.appendChild(script);
  });
};

// Add code copy function
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

// Initialize app after resources are loaded
async function initApp() {
  // Load external resources
  loadFontAwesome();
  await loadTailwind();

  // Create and mount the Vue app
  createApp(App).mount("#app");
}

initApp();
