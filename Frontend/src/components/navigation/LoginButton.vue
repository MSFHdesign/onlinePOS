<template>
  <div>
    <button 
      @click="toggleLoginDropdown"
      class="flex items-center justify-center p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
    >
      <i class="pi pi-user text-lg"></i>
    </button>
    
    <!-- Login Dropdown -->
    <div 
      v-if="loginDropdownOpen" 
      class="absolute right-4 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
    >
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
        Log ind
      </a>
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
        Opret konto
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const loginDropdownOpen = ref(false);

const toggleLoginDropdown = () => {
  loginDropdownOpen.value = !loginDropdownOpen.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (loginDropdownOpen.value) {
    loginDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script> 