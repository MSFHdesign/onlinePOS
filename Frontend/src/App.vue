<script setup lang="ts">
import { RouterView } from 'vue-router';
import ThemeToggler from './components/theme/ThemeToggler.vue';
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
    <header class="border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto p-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <i class="pi pi-shopping-cart text-xl text-primary-light dark:text-primary-dark"></i>
          <h1 class="text-2xl font-bold">OnlinePos</h1>
        </div>
        <ThemeToggler />
      </div>
    </header>
    
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
    
    <footer class="mt-8 border-t border-gray-200 dark:border-gray-700 py-4">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ new Date().getFullYear() }} OnlinePos. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style>
/* Base styles for dark/light mode */
:root {
  --color-primary: #6466f1;
  --color-secondary: #64748b;
}

.dark {
  --color-primary: #818cf8;
  --color-secondary: #94a3b8;
}

/* PrimeVue component styling with Tailwind */
.p-component {
  @apply font-sans;
}

.p-button {
  @apply inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors 
  bg-primary-light dark:bg-primary-dark text-white
  hover:bg-indigo-700 dark:hover:bg-indigo-500 
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}

.p-button.p-button-secondary {
  @apply bg-secondary-light dark:bg-secondary-dark
  hover:bg-slate-600 dark:hover:bg-slate-500;
}

.p-button.p-button-outlined {
  @apply bg-transparent border border-current
  text-primary-light dark:text-primary-dark
  hover:bg-indigo-50 dark:hover:bg-slate-800;
}

.p-button.p-button-secondary.p-button-outlined {
  @apply text-secondary-light dark:text-secondary-dark
  hover:bg-slate-100 dark:hover:bg-slate-800;
}

.p-inputtext, .p-textarea, .p-inputnumber-input {
  @apply rounded-md border border-gray-300 dark:border-gray-600 
  bg-white dark:bg-slate-800 
  text-gray-900 dark:text-gray-100
  shadow-sm px-3 py-2 
  focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none;
}

.p-card {
  @apply bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md;
}

.p-card .p-card-title {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.p-card .p-card-subtitle {
  @apply text-gray-500 dark:text-gray-400;
}

.p-card .p-card-content {
  @apply py-4;
}

.p-card .p-card-footer {
  @apply border-t border-gray-200 dark:border-gray-700 py-3 px-4;
}

.p-panel {
  @apply bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden;
}

.p-panel .p-panel-header {
  @apply border-b border-gray-200 dark:border-gray-700 py-3 px-4 bg-gray-50 dark:bg-slate-700;
}

.p-panel .p-panel-title {
  @apply text-lg font-medium text-gray-900 dark:text-white;
}

.p-panel .p-panel-content {
  @apply p-4;
}

.p-datatable {
  @apply bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden;
}

.p-datatable .p-datatable-header {
  @apply bg-gray-50 dark:bg-slate-700 py-3 px-4 border-b border-gray-200 dark:border-gray-700;
}

.p-datatable .p-datatable-thead > tr > th {
  @apply bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 border-b border-gray-200 dark:border-gray-700;
}

.p-datatable .p-datatable-tbody > tr {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.p-datatable .p-datatable-tbody > tr > td {
  @apply py-3 px-4 text-gray-900 dark:text-gray-100;
}

.p-datatable .p-datatable-tbody > tr:hover {
  @apply bg-gray-50 dark:bg-slate-700;
}

.p-toast {
  @apply shadow-lg;
}

.p-toast .p-toast-message {
  @apply rounded-lg border;
}

.p-toast .p-toast-message-success {
  @apply bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800;
}

.p-toast .p-toast-message-info {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800;
}

.p-toast .p-toast-message-warn {
  @apply bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800;
}

.p-toast .p-toast-message-error {
  @apply bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800;
}

.p-breadcrumb {
  @apply bg-transparent py-2;
}

.p-breadcrumb ul li .p-menuitem-link {
  @apply text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200;
}

.p-breadcrumb ul li.p-breadcrumb-chevron {
  @apply text-gray-400 dark:text-gray-600 mx-1;
}

.p-breadcrumb ul li:last-child .p-menuitem-link {
  @apply text-gray-900 dark:text-gray-200 font-medium;
}
</style>
