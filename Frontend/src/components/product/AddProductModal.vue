<template>
  <Modal 
    v-model="showModal" 
    title="Tilføj nyt produkt"
    @close="onClose"
  >
    <div class="grid grid-cols-1 gap-4">
      <!-- Basic info section -->
      <div class="space-y-3">
        <div class="form-group">
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Navn *</label>
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
          <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pris (DKK) *</label>
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
          <label for="vat" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Moms (%) *</label>
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
            placeholder="f.eks. 'Pizza'"
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
      
      <!-- Featured Product Checkbox -->
      <div class="form-group">
        <div class="flex items-center">
          <input 
            id="is_featured" 
            v-model="form.is_featured" 
            type="checkbox" 
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded border-gray-300"
          />
          <label for="is_featured" class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vis som fremhævet produkt
          </label>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Det fremhævede produkt vil blive vist i toppen af siden og i hero-sektionen
        </p>
      </div>
      
      <!-- Sort Order -->
      <div class="form-group">
        <label for="sort_order" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sorteringsorden
        </label>
        <input 
          id="sort_order" 
          v-model.number="form.sort_order" 
          type="number" 
          min="0" 
          step="1" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:border-gray-700 dark:text-white"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Lavere tal vises først. Produkter uden sorteringsorden vises sidst.
        </p>
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
      <div v-if="createStatus" class="mt-2" :class="{'text-green-600 dark:text-green-400': createStatus === 'success', 'text-red-600 dark:text-red-400': createStatus === 'error'}">
        <div v-if="createStatus === 'success'" class="flex items-center">
          <span class="pi pi-check-circle mr-1"></span>
          <p>Produkt oprettet!</p>
        </div>
        <div v-if="createStatus === 'error'" class="flex items-center">
          <span class="pi pi-times-circle mr-1"></span>
          <p>Der opstod en fejl ved oprettelse.</p>
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
          label="Opret" 
          icon="pi pi-plus" 
          class="modal-button modal-button-save p-button-success text-base px-5 py-2 min-w-[120px]" 
          :loading="loading" 
          @click="createProduct" 
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
import type { ProductFormData } from '@/types/Product';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'product-created', 'close', 'cancel']);

const showModal = ref(props.modelValue);
const { createProduct: createProductApi, loading } = useProduct();
const { getContrastColor } = useContrastColor();
const createStatus = ref<'success' | 'error' | null>(null);

// Create a form object for the new product
const form = ref({
  name: '',
  description: '',
  price: 0,
  vat: 25, // Default VAT in Denmark
  tag_name: '',
  tag_color: '#6466f1', // Default color
  is_featured: false,
  sort_order: 999 // Default to a high number (low priority)
});

// Watch for changes to props
watch(() => props.modelValue, (val) => {
  showModal.value = val;
  if (val) {
    // Reset form when opening modal
    resetForm();
  }
});

// Watch for changes to showModal
watch(showModal, (val) => {
  emit('update:modelValue', val);
});

// Reset form to defaults
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: 0,
    vat: 25,
    tag_name: '',
    tag_color: '#6466f1',
    is_featured: false,
    sort_order: 999
  };
  createStatus.value = null;
};

const createProduct = async () => {
  if (!form.value.name || form.value.price <= 0) {
    // Basic validation
    return;
  }
  
  createStatus.value = null;
  
  try {
    // Extract data for API
    const productData: ProductFormData = {
      name: form.value.name,
      description: form.value.description || '',
      price: form.value.price,
      vat: form.value.vat,
      tag_name: form.value.tag_name || null,
      tag_color: form.value.tag_color || null,
      is_featured: form.value.is_featured,
      sort_order: form.value.sort_order
    };
    
    // Call API to create product
    const result = await createProductApi(productData);
    createStatus.value = 'success';
    
    // Emit event to notify parent component
    emit('product-created', result);
    
    // Close the modal after a short delay
    setTimeout(() => {
      showModal.value = false;
      resetForm();
      emit('close', 'created'); // Send 'created' reason
    }, 1500);
  } catch (error) {
    console.error('Failed to create product:', error);
    createStatus.value = 'error';
  }
};

const onClose = () => {
  showModal.value = false;
  resetForm();
  emit('close', 'canceled'); // Send 'canceled' reason
};
</script>

<style scoped>
/* Component-specific styling */
.form-group {
  margin-bottom: 1rem;
}
</style> 