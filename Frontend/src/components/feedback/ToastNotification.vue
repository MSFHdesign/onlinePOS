<template>
  <!-- Toast component is used to show notifications -->
  <Toast position="top-right" />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// Define notification types
type NotificationType = 'success' | 'info' | 'warn' | 'error';

// Define notification function
const showNotification = (
  severity: NotificationType,
  summary: string,
  detail: string,
  life = 3000,
  closable = true
) => {
  toast.add({
    severity,
    summary,
    detail,
    life,
    closable
  });
};

// Provide the notification function to all child components
provide('showNotification', showNotification);
</script>

<style scoped>
/* Toast dark mode improvements */
:deep(.p-toast-message) {
  @apply dark:text-white;
}

:deep(.p-toast-message-success) {
  @apply dark:text-green-100;
}

:deep(.p-toast-message-info) {
  @apply dark:text-blue-100;
}

:deep(.p-toast-message-warn) {
  @apply dark:text-yellow-100;
}

:deep(.p-toast-message-error) {
  @apply dark:text-red-100;
}

:deep(.p-toast-icon) {
  @apply dark:text-white;
}

:deep(.p-toast-message-content .p-toast-detail) {
  @apply dark:text-gray-300;
}
</style> 