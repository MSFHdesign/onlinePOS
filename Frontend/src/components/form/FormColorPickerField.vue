<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-medium">{{ label }}</label>
    <div class="flex align-items-center gap-2">
      <ColorPicker 
        :id="id"
        v-model="colorValue"
        :disabled="disabled"
        :defaultColor="defaultColor"
        :class="{'p-invalid': error}"
        v-bind="$attrs"
      />
      <div 
        class="color-preview w-10 h-10 rounded-md border border-gray-300" 
        :style="{ backgroundColor: colorValue }"
      ></div>
    </div>
    <small v-if="helpText" class="block mt-1 text-gray-500">{{ helpText }}</small>
    <small v-if="error" class="p-error block mt-1">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string;
  id: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  defaultColor?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const colorValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script> 