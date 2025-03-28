<template>
  <Modal 
    v-model="showModal" 
    :title="product ? `Hurtig redigering: ${product.name}` : 'Rediger produkt'"
    @close="onClose"
  >
    <div v-if="product" class="grid grid-cols-1 gap-4">
      <!-- Product ID -->
      <div class="flex justify-between items-center mb-2">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Produkt ID: <span class="font-medium text-gray-700 dark:text-gray-300">{{ product.id }}</span>
        </div>
        <RouterLink :to="`/admin/product/${product.id}`" class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          <span>Fuld redigering</span>
          <span class="pi pi-external-link ml-1 text-xs"></span>
        </RouterLink>
      </div>
      
      <!-- Basic info section -->
      <div class="space-y-3">
        <div class="form-group">
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Navn</label>
          <input 
            id="name" 
            v-model="form.name" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        
        <div class="form-group">
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Beskrivelse</label>
          <textarea 
            id="description" 
            v-model="form.description" 
            rows="2" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-gray-700 dark:text-white"
          ></textarea>
        </div>
      </div>
      
      <!-- Pricing section -->
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pris (DKK)</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 dark:text-gray-400 sm:text-sm">kr.</span>
            </div>
            <input 
              id="price" 
              v-model.number="form.price" 
              type="number" 
              step="0.01" 
              min="0" 
              class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="vat" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Moms (%)</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <input 
              id="vat" 
              v-model.number="form.vat" 
              type="number" 
              step="0.1" 
              min="0" 
              max="100" 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-gray-700 dark:text-white pr-12"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tag section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="tag_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tag navn</label>
          <input 
            id="tag_name" 
            v-model="form.tag_name" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-gray-700 dark:text-white"
            placeholder="f.eks. 'Glutenfri'"
          />
        </div>
        
        <div class="form-group">
          <label for="tag_color" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tag farve</label>
          <div class="flex items-center mt-1">
            <input 
              id="tag_color" 
              v-model="form.tag_color" 
              type="color" 
              class="w-10 h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span class="ml-2 text-gray-600 dark:text-gray-400">{{ form.tag_color }}</span>
          </div>
        </div>
      </div>
      
      <!-- Tag preview -->
      <div class="mt-2">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag preview:</p>
        <span 
          v-if="form.tag_name"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :style="{
            backgroundColor: form.tag_color,
            color: getContrastColor(form.tag_color)
          }"
        >
          {{ form.tag_name }}
        </span>
        <span v-else class="text-sm text-gray-500 dark:text-gray-400 italic">Ingen tag</span>
      </div>
      
      <!-- Feedback message -->
      <div v-if="updateStatus" class="mt-2" :class="{'text-green-600 dark:text-green-400': updateStatus === 'success', 'text-red-600 dark:text-red-400': updateStatus === 'error'}">
        <div v-if="updateStatus === 'success'" class="flex items-center">
          <span class="pi pi-check-circle mr-1"></span>
          <p>Produkt opdateret!</p>
        </div>
        <div v-if="updateStatus === 'error'" class="flex items-center">
          <span class="pi pi-times-circle mr-1"></span>
          <p>Der opstod en fejl ved opdatering.</p>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="w-full flex justify-between space-x-4">
        <Button 
          label="Annuller" 
          icon="pi pi-times" 
          class="modal-button modal-button-cancel p-button-outlined p-button-danger text-base px-5 py-2 min-w-[120px]" 
          @click="onClose" 
          :disabled="loading"
        />
        <Button 
          label="Gem" 
          icon="pi pi-check" 
          class="modal-button modal-button-save p-button-success text-base px-5 py-2 min-w-[120px]" 
          :loading="loading" 
          @click="saveChanges" 
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import Modal from '@/components/common/Modal.vue';
import Button from 'primevue/button';
import { useProduct } from '@/composables/useProduct';
import { useContrastColor } from '@/composables/useContrastColor';
import type { Product } from '@/types/Product';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  modelValue: boolean;
  product: Product | null;
}>();

const emit = defineEmits(['update:modelValue', 'product-updated', 'close', 'cancel']);

const showModal = ref(props.modelValue);
const { updateProduct, loading } = useProduct();
const { getContrastColor } = useContrastColor();
const updateStatus = ref<'success' | 'error' | null>(null);

// Create a form object to track edits
const form = ref({
  name: '',
  description: '',
  price: 0,
  vat: 25, // Default VAT in Denmark
  tag_name: '',
  tag_color: '#6466f1' // Default color
});

// Watch for changes to props
watch(() => props.modelValue, (val) => {
  showModal.value = val;
});

watch(() => props.product, (val) => {
  if (val) {
    // Initialize form with product data
    form.value = {
      name: val.name,
      description: val.description || '',
      price: typeof val.price === 'string' ? parseFloat(val.price) : val.price,
      vat: typeof val.vat === 'string' ? parseFloat(val.vat) : val.vat,
      tag_name: val.tag_name || '',
      tag_color: val.tag_color || '#6466f1'
    };
  }
});

// Watch for changes to showModal
watch(showModal, (val) => {
  emit('update:modelValue', val);
});

const saveChanges = async () => {
  if (!props.product) return;
  
  updateStatus.value = null;
  
  try {
    await updateProduct(props.product.id, form.value);
    updateStatus.value = 'success';
    
    // Emit event to notify parent component
    emit('product-updated', {
      ...props.product,
      ...form.value
    });
    
    // Close the modal after a short delay - use specific close for save
    setTimeout(() => {
      showModal.value = false;
      updateStatus.value = null;
      emit('close', 'saved'); // Send 'saved' reason
    }, 1500);
  } catch (error) {
    console.error('Failed to update product:', error);
    updateStatus.value = 'error';
  }
};

const onClose = () => {
  showModal.value = false;
  updateStatus.value = null;
  
  // Only emit 'cancel' if there was no successful update
  if (updateStatus.value !== 'success') {
    emit('cancel'); // Explicit cancel event
  }
  emit('close', 'canceled'); // Send 'canceled' reason
};
</script>

<style scoped>
/* Additional styles if needed */
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: transparent;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: 1px solid #ddd;
  border-radius: 4px;
}
.dark input[type="color"]::-webkit-color-swatch {
  border-color: #4b5563;
}

/* Modal button styles */
.modal-button {
  letter-spacing: 0.025em;
}

/* Button enhancements */
:deep(.p-button) {
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 150ms ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-button:focus) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

:deep(.p-button.p-button-success) {
  background-color: #10b981;
  border-color: #10b981;
}

:deep(.p-button.p-button-success:hover) {
  background-color: #059669;
  border-color: #059669;
}

:deep(.p-button.p-button-outlined.p-button-danger) {
  color: #ef4444;
  border-color: #ef4444;
}

:deep(.p-button.p-button-outlined.p-button-danger:hover) {
  background-color: rgba(239, 68, 68, 0.04);
  color: #dc2626;
  border-color: #dc2626;
}

/* Dark mode button enhancements - Simplified with lighter colors */
:deep(.dark .p-button.p-button-success) {
  background-color: #34d399; /* Much lighter green */
  border-color: #34d399;
  color: #000000; /* Black text on light green for maximum contrast */
  font-weight: 600;
}

:deep(.dark .p-button.p-button-success:hover) {
  background-color: #6ee7b7; /* Even lighter green on hover */
  border-color: #10b981;
}

:deep(.dark .p-button.p-button-outlined.p-button-danger) {
  color: #ffffff; /* Pure white text */
  background-color: rgba(239, 68, 68, 0.3); /* More visible red background */
  border-color: #f87171;
  border-width: 2px;
  font-weight: 600;
}

:deep(.dark .p-button.p-button-outlined.p-button-danger:hover) {
  background-color: rgba(239, 68, 68, 0.4); /* Stronger red background on hover */
  color: #ffffff;
  border-color: #fca5a5;
}

:deep(.dark .p-button:focus) {
  outline: 2px solid #60a5fa; /* Brighter blue for dark mode */
  outline-offset: 2px;
}

:deep(.dark .p-button .p-button-icon) {
  color: currentColor;
}

:deep(.dark .p-button .p-button-label) {
  font-weight: 600;
}

/* Simplified text visibility enhancement */
:deep(.dark .modal-button-save.p-button .p-button-label),
:deep(.dark .modal-button-save.p-button .p-button-icon) {
  color: #000000; /* Black text on light background */
}

:deep(.dark .modal-button-cancel.p-button .p-button-label),
:deep(.dark .modal-button-cancel.p-button .p-button-icon) {
  color: #ffffff; /* White text */
}
</style> 