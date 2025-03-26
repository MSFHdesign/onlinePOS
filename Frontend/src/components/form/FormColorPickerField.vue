<template>
  <div class="field">
    <label :for="id" class="block mb-2 font-medium text-gray-700 dark:text-gray-200">{{ label }}</label>
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <ColorPicker 
            :id="id"
            v-model="colorValue"
            :disabled="disabled"
            :defaultColor="defaultColor"
            format="hex"
            :class="['color-picker-field', {'p-invalid': error}]"
            v-bind="$attrs"
            panelClass="color-picker-panel"
            appendTo="body"
          />
          <div class="flex-1">
            <InputText 
              v-model="hexColor" 
              class="w-full hex-input" 
              placeholder="#RRGGBB"
              @input="updateFromHexInput"
            />
          </div>
        </div>
        <div class="flex items-center gap-2 mt-1">
          <div 
            class="color-preview w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm" 
            :style="{ backgroundColor: colorValue }"
          ></div>
        </div>
      </div>
      
      <div class="preset-colors">
        <label class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Foruddefinerede farver</label>
        <div class="grid grid-cols-5 gap-2">
          <button 
            v-for="color in presetColors" 
            :key="color"
            type="button"
            class="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :style="{ backgroundColor: color }"
            @click="selectPresetColor(color)"
            :class="{'ring-2 ring-offset-2 ring-indigo-500': colorValue === color}"
          ></button>
        </div>
      </div>
    </div>
    <small v-if="helpText" class="block mt-1 text-gray-500 dark:text-gray-400">{{ helpText }}</small>
    <small v-if="error" class="p-error block mt-1 text-red-600 dark:text-red-400">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, watch } from 'vue';

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

// For direct hex input
const hexColor = ref(props.modelValue);

// Update hexColor when colorValue changes
watch(() => colorValue.value, (newColor) => {
  hexColor.value = newColor;
});

// Update color from hex input
const updateFromHexInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    emit('update:modelValue', value);
  }
};

// Preset colors for quick selection
const presetColors = ref([
  '#6466f1', // Indigo
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#000000'  // Black
]);

const selectPresetColor = (color: string) => {
  emit('update:modelValue', color);
};
</script>

<style>
/* Global style to ensure the color picker panel appears correctly */
.p-colorpicker-panel.color-picker-panel {
  background-color: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.375rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  padding: 0.5rem !important;
  z-index: 1000 !important;
}

.dark .p-colorpicker-panel.color-picker-panel {
  background-color: #1e293b !important;
  border-color: #475569 !important;
  color: white !important;
}

.dark .p-colorpicker-panel.color-picker-panel .p-colorpicker-hue,
.dark .p-colorpicker-panel.color-picker-panel .p-colorpicker-color {
  border-color: #475569 !important;
}
</style>

<style scoped>
.color-picker-field {
  @apply w-full sm:w-auto border border-gray-300 dark:border-gray-600
         bg-white dark:bg-slate-800
         rounded-md cursor-pointer;
  min-width: 60px;
}

.color-picker-field :deep(.p-colorpicker-preview) {
  @apply w-full border border-gray-300 dark:border-gray-600
         overflow-hidden;
  height: 2.25rem;
}

/* Make sure the ColorPicker is clickable */
.color-picker-field :deep(.p-colorpicker) {
  @apply relative w-full cursor-pointer;
}

/* Hex input field */
.hex-input {
  @apply text-sm;
}

/* Ensure the color panel shows up properly */
:deep(.p-colorpicker-overlay-panel) {
  @apply z-50;
}

.preset-colors {
  @apply flex flex-col;
}
</style> 