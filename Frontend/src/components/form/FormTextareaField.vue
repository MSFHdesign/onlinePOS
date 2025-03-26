<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-medium">{{ label }}</label>
    <Textarea 
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :autoResize="autoResize"
      :class="['w-full', {'p-invalid': error}]"
      v-bind="$attrs"
    />
    <small v-if="helpText" class="block mt-1 text-gray-500">{{ helpText }}</small>
    <small v-if="error" class="p-error block mt-1">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
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