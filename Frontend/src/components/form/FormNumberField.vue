<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-medium">{{ label }}</label>
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
</script> 