<template>
  <div class="hidden md:flex items-center space-x-4">
    <RouterLink 
      to="/takeaway" 
      class="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark px-3 py-2 rounded-md font-medium transition-colors" 
      active-class="text-primary-light dark:text-primary-dark font-semibold"
    >
      Take Away
    </RouterLink>
    <RouterLink 
      to="/admin" 
      class="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark px-3 py-2 rounded-md font-medium transition-colors"
      active-class="text-primary-light dark:text-primary-dark font-semibold"
    >
      Admin
    </RouterLink>
  </div>
  
  <!-- Mobile Menu Button - Only visible on smaller screens -->
  <div class="md:hidden">
    <button 
      @click="toggleMobileMenu"
      class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
    >
      <i class="pi pi-bars"></i>
    </button>
    
    <!-- Mobile Menu Dropdown -->
    <div 
      v-if="mobileMenuOpen" 
      class="absolute top-16 left-0 right-0 bg-white dark:bg-slate-800 shadow-md py-2 z-50 border-t border-gray-200 dark:border-gray-700"
    >
      <RouterLink 
        to="/takeaway" 
        class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="mobileMenuOpen = false"
      >
        Take Away
      </RouterLink>
      <RouterLink 
        to="/admin" 
        class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="mobileMenuOpen = false"
      >
        Admin
      </RouterLink>
      <div class="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
        <span class="text-gray-700 dark:text-gray-300">Skift tema</span>
        <ThemeToggler />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import ThemeToggler from '../theme/ThemeToggler.vue';

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script> 