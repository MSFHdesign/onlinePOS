<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">{{ label }}</label>
    <Textarea 
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :autoResize="autoResize"
      :class="['w-full textarea-field', {'p-invalid': error}]"
      v-bind="$attrs"
    />
    <small v-if="helpText" class="block mt-1 text-gray-500 dark:text-gray-400">{{ helpText }}</small>
    <small v-if="error" class="p-error block mt-1 text-red-600 dark:text-red-400">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  label: string;
  modelValue: string;
  id: string;
  placeholder?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  autoResize?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
.textarea-field {
  @apply bg-white dark:bg-slate-800 
         text-gray-900 dark:text-gray-100
         border-gray-300 dark:border-gray-600
         focus:border-indigo-500 dark:focus:border-indigo-400;
}

.p-inputtextarea::placeholder {
  @apply text-gray-400 dark:text-gray-500;
}
</style> 