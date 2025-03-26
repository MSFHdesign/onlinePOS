<template>
  <button 
    @click="toggleTheme" 
    class="p-2 rounded-full transition-colors duration-200 hover:bg-surface-light dark:hover:bg-surface-dark focus:outline-none"
    aria-label="Toggle theme"
  >
    <!-- Sun icon for dark mode (shown when in dark mode) -->
    <i v-if="isDarkMode" class="pi pi-sun text-xl text-yellow-400"></i>
    
    <!-- Moon icon for light mode (shown when in light mode) -->
    <i v-else class="pi pi-moon text-xl text-indigo-600"></i>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const isDarkMode = ref(false);

// Initialize theme
onMounted(() => {
  // Check for user's preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  
  // Check for system preference if no saved preference
  if (!savedTheme) {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDarkMode.value = savedTheme === 'dark';
  }
  
  // Apply the theme
  applyTheme();
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches;
    }
  });
});

// Watch for changes to isDarkMode
watch(isDarkMode, () => {
  applyTheme();
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
});

// Apply the appropriate class to the document
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Toggle between light and dark
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script> 