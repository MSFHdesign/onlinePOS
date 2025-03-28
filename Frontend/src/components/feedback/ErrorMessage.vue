<template>
  <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <span class="pi pi-exclamation-triangle text-red-500 dark:text-red-400"></span>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
          {{ title }}
        </h3>
        <div v-if="message" class="mt-2 text-sm text-red-700 dark:text-red-400">
          <p>{{ message }}</p>
        </div>
        <div v-if="retry" class="mt-4">
          <button
            type="button"
            @click="$emit('retry')"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {{ retryText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Der opstod en fejl'
  },
  message: {
    type: String,
    default: ''
  },
  retry: {
    type: Boolean,
    default: false
  },
  retryText: {
    type: String,
    default: 'Prøv igen'
  }
})

defineEmits(['retry'])
</script> 