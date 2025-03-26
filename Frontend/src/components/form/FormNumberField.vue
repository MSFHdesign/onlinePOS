<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">{{ label }}</label>
    <div class="number-field-container relative w-full">
      <InputNumber 
        :id="id"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :mode="mode"
        :prefix="prefix"
        :suffix="suffix"
        :showButtons="showButtons"
        class="w-full custom-input-number"
        :class="{'p-invalid': error}"
        v-bind="$attrs"
      />
      
      <!-- Display the suffix manually as text if needed -->
      <div v-if="suffix && suffix !== '%' && suffix !== 'kr.'" 
           class="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 pointer-events-none">
        {{ suffix }}
      </div>
    </div>
    <small v-if="helpText" class="block mt-1 text-gray-500 dark:text-gray-400">{{ helpText }}</small>
    <small v-if="error" class="p-error block mt-1 text-red-600 dark:text-red-400">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: number;
  id: string;
  placeholder?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  mode?: 'decimal' | 'currency';
  prefix?: string;
  suffix?: string;
  showButtons?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

// Apply dark mode fixes after component mounts
onMounted(() => {
  // Force update the styling
  setTimeout(() => {
    const inputElement = document.getElementById(props.id)?.querySelector('input');
    if (inputElement && document.documentElement.classList.contains('dark')) {
      inputElement.style.color = 'white';
      inputElement.style.backgroundColor = '#1e293b';
    }
  }, 0);
});
</script>

<style>
/* Global overrides - will apply to all InputNumber components */
.dark .p-inputnumber .p-inputnumber-input {
  background-color: #1e293b !important;
  color: white !important;
  border-color: #475569 !important;
}

.dark .p-inputtext {
  background-color: #1e293b !important;
  color: white !important;
  border-color: #475569 !important;
}

.dark .p-inputnumber-button-group {
  background-color: #1e293b !important;
  border-color: #475569 !important;
}

.dark .p-inputnumber-button {
  background-color: #334155 !important;
  color: white !important;
  border-color: #475569 !important;
}

.dark .p-inputnumber-button:hover {
  background-color: #475569 !important;
}
</style>

<style scoped>
.custom-input-number :deep(input) {
  @apply bg-white dark:bg-slate-800
         text-gray-900 dark:text-gray-100
         border-gray-300 dark:border-gray-600
         w-full rounded-md px-3 py-2;
}

.number-field-container {
  @apply rounded-md;
}

.dark .custom-input-number :deep(input) {
  background-color: #1e293b !important;
  color: white !important;
}

.dark .number-field-container :deep(.p-inputnumber-button) {
  @apply bg-slate-700 text-gray-300 border-gray-600;
}

/* Fix input appearance in dark mode */
.dark .custom-input-number :deep(input::placeholder) {
  color: #94a3b8 !important;
}

/* Make sure input is visible in any theme */
.custom-input-number {
  @apply bg-transparent;
}
</style> 