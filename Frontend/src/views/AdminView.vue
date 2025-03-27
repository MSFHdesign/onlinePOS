<template>
  <div class="p-4 max-w-5xl mx-auto">
    <div class="mb-6 bg-white dark:bg-slate-800 rounded-lg shadow p-5">
      <h1 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-300">Administrer dine produkter og indstillinger</p>

      <div class="mt-4 flex space-x-4">
        <RouterLink 
          to="/admin/products" 
          class="px-4 py-2 bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark rounded-md hover:bg-primary-light/20 dark:hover:bg-primary-dark/30 transition-colors"
          active-class="bg-primary-light/20 dark:bg-primary-dark/30 font-medium"
        >
          <i class="pi pi-box mr-2"></i>Produkter
        </RouterLink>
        
        <RouterLink 
          to="/admin/settings" 
          class="px-4 py-2 bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark rounded-md hover:bg-primary-light/20 dark:hover:bg-primary-dark/30 transition-colors"
          active-class="bg-primary-light/20 dark:bg-primary-dark/30 font-medium"
        >
          <i class="pi pi-cog mr-2"></i>Indstillinger
        </RouterLink>
      </div>
    </div>

    <!-- Admin content area -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script> 