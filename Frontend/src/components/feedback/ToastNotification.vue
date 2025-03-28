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

// Define notification function with default life increased for better readability
const showNotification = (
  severity: NotificationType,
  summary: string,
  detail: string,
  life = 4000, // Increased from 3000 to 4000ms for better readability
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
/* Master toast container styles */
:deep(.p-toast) {
  opacity: 1;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  z-index: 9999;
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

/* Base toast message styling with glassmorphism effect */
:deep(.p-toast-message) {
  margin-bottom: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0;
  overflow: hidden;
  max-width: 380px;
  min-width: 330px;
  transform-origin: top right;
  animation: toast-enter 0.45s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
}

/* Toast message content layout */
:deep(.p-toast-message-content) {
  display: flex;
  padding: 0;
  position: relative;
}

/* Status indicator bar on the left */
:deep(.p-toast-message-content)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
}

/* Message text container */
:deep(.p-toast-message-text) {
  flex: 1;
  padding: 1rem 1rem 1rem 1.25rem;
  position: relative;
}

/* Toast Icon Styling */
:deep(.p-toast-icon) {
  margin-right: 0.75rem;
  font-size: 1.5rem;
  display: inline-flex;
  background-color: currentColor;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 0.125rem;
  position: relative;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
  animation: toast-icon-entry 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s, 
             toast-icon-pulse 3s ease-in-out infinite 1s;
  opacity: 0;
  transform: scale(0.5);
}

:deep(.p-toast-icon)::before {
  font-family: 'primeicons';
  color: white;
  position: relative;
  z-index: 2;
}

/* Add icon glow effect */
:deep(.p-toast-icon)::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: inherit;
  filter: blur(8px);
  opacity: 0.7;
  z-index: 1;
}

/* Success Toast Styling - Modern Green */
:deep(.p-toast-message-success) {
  background: linear-gradient(145deg, rgba(240, 253, 244, 0.98), rgba(220, 252, 231, 0.98));
}

:deep(.p-toast-message-success .p-toast-message-content)::before {
  background: linear-gradient(to bottom, #10b981, #059669);
}

:deep(.p-toast-message-success .p-toast-icon) {
  background: linear-gradient(145deg, #10b981, #059669);
}

/* Info Toast Styling - Modern Blue */
:deep(.p-toast-message-info) {
  background: linear-gradient(145deg, rgba(239, 246, 255, 0.98), rgba(219, 234, 254, 0.98));
}

:deep(.p-toast-message-info .p-toast-message-content)::before {
  background: linear-gradient(to bottom, #3b82f6, #2563eb);
}

:deep(.p-toast-message-info .p-toast-icon) {
  background: linear-gradient(145deg, #3b82f6, #2563eb);
}

/* Warning Toast Styling - Modern Amber */
:deep(.p-toast-message-warn) {
  background: linear-gradient(145deg, rgba(255, 251, 235, 0.98), rgba(254, 243, 199, 0.98));
}

:deep(.p-toast-message-warn .p-toast-message-content)::before {
  background: linear-gradient(to bottom, #f59e0b, #d97706);
}

:deep(.p-toast-message-warn .p-toast-icon) {
  background: linear-gradient(145deg, #f59e0b, #d97706);
}

/* Error Toast Styling - Modern Red */
:deep(.p-toast-message-error) {
  background: linear-gradient(145deg, rgba(254, 242, 242, 0.98), rgba(254, 226, 226, 0.98));
}

:deep(.p-toast-message-error .p-toast-message-content)::before {
  background: linear-gradient(to bottom, #ef4444, #dc2626);
}

:deep(.p-toast-message-error .p-toast-icon) {
  background: linear-gradient(145deg, #ef4444, #dc2626);
}

/* Dark mode toast styling - Modern Dark Glassmorphism */
:deep(.dark .p-toast-message) {
  background: rgba(31, 41, 55, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

:deep(.dark .p-toast-message-success) {
  background: linear-gradient(145deg, rgba(6, 78, 59, 0.85), rgba(6, 95, 70, 0.85));
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(16, 185, 129, 0.3);
}

:deep(.dark .p-toast-message-info) {
  background: linear-gradient(145deg, rgba(30, 58, 138, 0.85), rgba(30, 64, 175, 0.85));
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(59, 130, 246, 0.3);
}

:deep(.dark .p-toast-message-warn) {
  background: linear-gradient(145deg, rgba(120, 53, 15, 0.85), rgba(146, 64, 14, 0.85));
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(245, 158, 11, 0.3);
}

:deep(.dark .p-toast-message-error) {
  background: linear-gradient(145deg, rgba(127, 29, 29, 0.85), rgba(153, 27, 27, 0.85));
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 15px rgba(239, 68, 68, 0.4);
}

/* Toast typography with improved styling */
:deep(.p-toast-summary) {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  color: rgba(17, 24, 39, 0.95);
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;
}

:deep(.p-toast-detail) {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: rgba(55, 65, 81, 0.95);
  opacity: 0.95;
}

/* Dark mode typography */
:deep(.dark .p-toast-summary) {
  color: rgba(255, 255, 255, 0.98);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

:deep(.dark .p-toast-detail) {
  color: rgba(229, 231, 235, 0.95);
}

/* Success toast specific icon styling */
:deep(.p-toast-message-success .p-toast-icon)::before {
  content: '\e909'; /* PrimeIcons check */
}

/* Info toast specific icon styling */
:deep(.p-toast-message-info .p-toast-icon)::before {
  content: '\e924'; /* PrimeIcons info-circle */
}

/* Warning toast specific icon styling */
:deep(.p-toast-message-warn .p-toast-icon)::before {
  content: '\e982'; /* PrimeIcons exclamation-triangle */
}

/* Error toast specific icon styling */
:deep(.p-toast-message-error .p-toast-icon)::before {
  content: '\e90b'; /* PrimeIcons times-circle */
}

/* Enhanced toast close button */
:deep(.p-toast-icon-close) {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: transparent;
  color: rgba(107, 114, 128, 0.7);
  opacity: 0.7;
  transition: all 0.2s ease;
  z-index: 5;
}

:deep(.p-toast-icon-close:hover) {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(17, 24, 39, 0.9);
  opacity: 1;
  transform: rotate(90deg);
}

:deep(.dark .p-toast-icon-close) {
  color: rgba(229, 231, 235, 0.7);
}

:deep(.dark .p-toast-icon-close:hover) {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
}

/* Toast animations */
@keyframes toast-icon-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.1);
  }
}

@keyframes toast-icon-entry {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes toast-enter {
  0% {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
  70% {
    transform: translateX(-5%) scale(1.02);
    opacity: 1;
  }
  85% {
    transform: translateX(2%) scale(0.99);
  }
  95% {
    transform: translateX(-1%) scale(1.01);
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

/* Shimmer effect animation */
:deep(.p-toast-message)::after {
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
  animation: shimmer 2.5s infinite;
  pointer-events: none;
}

:deep(.dark .p-toast-message)::after {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Progress bar for toast timeout */
:deep(.p-toast-message)::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  animation: progress 4s linear forwards; /* Default to 4s */
  z-index: 5;
}

:deep(.p-toast-message-success)::before {
  background: linear-gradient(to right, #059669, #10b981);
  animation: progress 4s linear forwards; /* Success toasts are typically 4s */
}

:deep(.p-toast-message-info)::before {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  animation: progress 3s linear forwards; /* Info toasts are typically 3s */
}

:deep(.p-toast-message-warn)::before {
  background: linear-gradient(to right, #d97706, #f59e0b);
  animation: progress 5s linear forwards; /* Warning toasts are typically 5s */
}

:deep(.p-toast-message-error)::before {
  background: linear-gradient(to right, #dc2626, #ef4444);
  animation: progress 5s linear forwards; /* Error toasts are typically 5s */
}

@keyframes progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}
</style> 