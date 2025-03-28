<template>
  <div 
    class="loading-container" 
    :class="[
      size === 'small' ? 'py-2' : 'py-8',
      fullScreen ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 z-50' : ''
    ]"
  >
    <div class="flex flex-col items-center justify-center">
      <div 
        class="spinner" 
        :class="{ 
          'w-8 h-8 border-4': size === 'small',
          'w-12 h-12 border-[5px]': size === 'medium',
          'w-16 h-16 border-[6px]': size === 'large'
        }"
      ></div>
      <p v-if="message" class="mt-4 text-gray-600 dark:text-gray-300 text-center">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  message: {
    type: String,
    default: 'Indlæser...'
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.spinner {
  @apply rounded-full border-gray-300 dark:border-gray-700;
  border-top-color: #3b82f6; /* blue-500 */
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 