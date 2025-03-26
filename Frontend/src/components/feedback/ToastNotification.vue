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