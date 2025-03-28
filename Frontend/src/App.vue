<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/navigation/NavBar.vue';
import { useRestaurant } from './composables/useRestaurant';

// Access the restaurant store (which was already provided in main.ts)
const { restaurant } = useRestaurant();
</script>

<template>
  <div class="min-h-screen transition-colors duration-300 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
    <NavBar />
    
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
    
    <footer class="mt-8 border-t border-gray-200 dark:border-gray-700 py-4">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ new Date().getFullYear() }} {{ restaurant.name || 'OnlinePos' }}. All rights reserved.
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

/* Override PrimeVue default text color for dark mode inputs */
.dark .p-inputtext, 
.dark .p-textarea, 
.dark .p-inputnumber-input {
  color: white !important;
  background-color: #1e293b !important;
  border-color: #475569 !important;
}

/* Direct style to ensure inputs are visible */
.dark input, 
.dark textarea, 
.dark select,
.dark .p-inputtext, 
.dark .p-inputnumber input,
.dark .p-inputnumber-input {
  color: white !important;
  background-color: #1e293b !important;
  border-color: #475569 !important;
}

/* Even more specific selector for InputNumber */
.dark .p-inputnumber .p-component.p-inputtext,
.dark input.p-inputtext.p-component {
  color: white !important;
  background-color: #1e293b !important;
}

/* Add placeholder styling for all inputs */
::placeholder {
  @apply text-gray-400 dark:text-gray-500;
}

.p-inputtext.p-invalid, .p-textarea.p-invalid, .p-inputnumber.p-invalid .p-inputnumber-input {
  @apply border-red-500 dark:border-red-400;
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

/* Add enhanced Toast styling */
.p-toast {
  opacity: 1;
  z-index: 9999;
  filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.1)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.12));
}

.p-toast-message {
  margin-bottom: 1rem !important;
  border-radius: 1rem !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1) !important;
  background-color: white !important;
  backdrop-filter: blur(10px);
  overflow: hidden;
  padding: 0 !important;
  max-width: 380px;
  min-width: 330px;
  animation: toast-in 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) forwards !important;
  transform-origin: top right;
}

.p-toast-message-content {
  padding: 0 !important;
  position: relative;
}

.p-toast-message-content::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
}

.p-toast-message-text {
  padding: 1rem 1rem 1rem 1.25rem !important;
}

.p-toast-icon {
  margin-right: 0.75rem !important;
  font-size: 1.5rem !important;
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  background-color: currentColor;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  animation: icon-pulse 2s infinite ease-in-out !important;
}

.p-toast-icon::before {
  font-family: 'primeicons';
  color: white;
  position: relative;
  z-index: 2;
}

.p-toast-summary {
  font-weight: 700 !important;
  font-size: 1.125rem !important;
  margin-bottom: 0.25rem !important;
}

.p-toast-detail {
  font-size: 0.9375rem !important;
  line-height: 1.5 !important;
}

/* Toast types */
.p-toast-message-success {
  background: linear-gradient(145deg, rgba(240, 253, 244, 0.98), rgba(220, 252, 231, 0.98)) !important;
}

.p-toast-message-success .p-toast-message-content::before {
  background: linear-gradient(to bottom, #10b981, #059669);
}

.p-toast-message-success .p-toast-icon {
  background: linear-gradient(145deg, #10b981, #059669) !important;
}

.p-toast-message-success .p-toast-icon::before {
  content: "\e909" !important; /* PrimeIcons check */
}

.p-toast-message-info {
  background: linear-gradient(145deg, rgba(239, 246, 255, 0.98), rgba(219, 234, 254, 0.98)) !important;
}

.p-toast-message-info .p-toast-message-content::before {
  background: linear-gradient(to bottom, #3b82f6, #2563eb);
}

.p-toast-message-info .p-toast-icon {
  background: linear-gradient(145deg, #3b82f6, #2563eb) !important;
}

.p-toast-message-info .p-toast-icon::before {
  content: "\e924" !important; /* PrimeIcons info-circle */
}

.p-toast-message-warn {
  background: linear-gradient(145deg, rgba(255, 251, 235, 0.98), rgba(254, 243, 199, 0.98)) !important;
}

.p-toast-message-warn .p-toast-message-content::before {
  background: linear-gradient(to bottom, #f59e0b, #d97706);
}

.p-toast-message-warn .p-toast-icon {
  background: linear-gradient(145deg, #f59e0b, #d97706) !important;
}

.p-toast-message-warn .p-toast-icon::before {
  content: "\e982" !important; /* PrimeIcons exclamation-triangle */
}

.p-toast-message-error {
  background: linear-gradient(145deg, rgba(254, 242, 242, 0.98), rgba(254, 226, 226, 0.98)) !important;
}

.p-toast-message-error .p-toast-message-content::before {
  background: linear-gradient(to bottom, #ef4444, #dc2626);
}

.p-toast-message-error .p-toast-icon {
  background: linear-gradient(145deg, #ef4444, #dc2626) !important;
}

.p-toast-message-error .p-toast-icon::before {
  content: "\e90b" !important; /* PrimeIcons times-circle */
}

/* Dark mode */
.dark .p-toast-message {
  background: rgba(31, 41, 55, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px);
}

.dark .p-toast-message-success {
  background: linear-gradient(145deg, rgba(6, 78, 59, 0.95), rgba(6, 95, 70, 0.95)) !important;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px 2px rgba(16, 185, 129, 0.4) !important;
}

.dark .p-toast-message-info {
  background: linear-gradient(145deg, rgba(30, 58, 138, 0.95), rgba(30, 64, 175, 0.95)) !important;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px 2px rgba(59, 130, 246, 0.4) !important;
}

.dark .p-toast-message-warn {
  background: linear-gradient(145deg, rgba(120, 53, 15, 0.95), rgba(146, 64, 14, 0.95)) !important;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px 2px rgba(245, 158, 11, 0.4) !important;
}

.dark .p-toast-message-error {
  background: linear-gradient(145deg, rgba(127, 29, 29, 0.95), rgba(153, 27, 27, 0.95)) !important;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px 2px rgba(239, 68, 68, 0.5) !important;
}

.dark .p-toast-summary {
  color: rgba(255, 255, 255, 1) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  font-weight: 700 !important;
}

.dark .p-toast-detail {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1) !important;
}

/* Animation for icon */
@keyframes icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Animation for toast entry */
@keyframes toast-in {
  0% { transform: translateX(100%) scale(0.8); opacity: 0; }
  80% { transform: translateX(-10px) scale(1.01); }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}

/* Shimmer effect for toast */
.p-toast-message::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Enhanced close button */
.p-toast-icon-close {
  position: absolute !important;
  top: 0.75rem !important;
  right: 0.75rem !important;
  width: 1.5rem !important;
  height: 1.5rem !important;
  border-radius: 50% !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
  color: rgba(100, 116, 139, 0.8) !important;
  transition: all 0.2s ease !important;
}

.p-toast-icon-close:hover {
  transform: rotate(90deg) !important;
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: rgba(0, 0, 0, 0.7) !important;
}

.dark .p-toast-icon-close {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* Progress bar for toast timeout */
.p-toast-message::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  animation: progress 4s linear forwards;
  z-index: 5;
}

.p-toast-message-success::before {
  background: linear-gradient(to right, #059669, #10b981);
}

.p-toast-message-info::before {
  background: linear-gradient(to right, #2563eb, #3b82f6);
}

.p-toast-message-warn::before {
  background: linear-gradient(to right, #d97706, #f59e0b);
}

.p-toast-message-error::before {
  background: linear-gradient(to right, #dc2626, #ef4444);
}

@keyframes progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

/* Add ColorPicker specific styling */
.p-colorpicker {
  position: relative;
  display: inline-block;
}

.p-colorpicker-preview {
  cursor: pointer;
}

.dark .p-colorpicker-overlay {
  background-color: #1e293b !important;
  color: white !important;
}

.p-colorpicker-panel {
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dark .p-colorpicker-panel {
  background-color: #1e293b !important;
  border-color: #475569 !important;
}

.p-component-overlay-enter {
  animation: overlay-enter 150ms forwards;
}

.p-component-overlay-leave {
  animation: overlay-leave 150ms forwards;
}

@keyframes overlay-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlay-leave {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
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
