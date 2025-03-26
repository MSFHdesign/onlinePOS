<template>
  <form @submit.prevent="handleSubmit" class="p-fluid">
    <Card class="mb-4">
      <template #title>
        <div class="flex align-items-center">
          <i class="pi pi-tag mr-2"></i>
          <span>{{ title }}</span>
        </div>
      </template>
      <template #subtitle>
        <span class="text-sm text-gray-500">Udfyld venligst alle felter markeret med *</span>
      </template>
      <template #content>
        <div class="grid grid-cols-1 gap-4">
          <FormInputField
            id="product-name"
            v-model="formData.name"
            label="Produktnavn"
            placeholder="Indtast produktnavn"
            required
            :error="errors.name"
          />
          
          <FormTextareaField
            id="product-description"
            v-model="formData.description"
            label="Beskrivelse"
            placeholder="Skriv en beskrivelse af produktet"
            rows="3"
            autoResize
            :error="errors.description"
          />
          
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-center justify-end mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300 mr-2">
                {{ priceMode === 'withVat' ? 'Pris inkl. moms' : 'Pris ekskl. moms' }}
              </span>
              <div 
                @click="togglePriceMode" 
                class="relative inline-flex items-center h-6 rounded-full w-12 cursor-pointer transition-colors"
                :class="priceMode === 'withVat' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-gray-600'"
              >
                <span 
                  class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full shadow-md"
                  :class="priceMode === 'withVat' ? 'translate-x-7' : 'translate-x-1'"
                ></span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormNumberField
                id="product-price"
                v-model="displayPrice"
                :label="priceMode === 'withVat' ? 'Pris (inkl. moms)' : 'Pris (ekskl. moms)'"
                placeholder="0.00"
                min="0"
                step="0.01"
                mode="decimal"
                suffix=" kr."
                required
                :error="errors.price"
                :helpText="priceMode === 'withVat' ? 'Pris inkluderer moms på ' + formData.vat + '%' : 'Indtast pris uden moms'"
                @update:modelValue="updatePrice"
              />
              
              <div class="flex flex-col">
                <FormNumberField
                  id="product-vat"
                  v-model="formData.vat"
                  label="Momssats"
                  placeholder="25"
                  min="0"
                  max="100"
                  suffix=" %"
                  required
                  :error="errors.vat"
                  helpText="Standard momssats er 25%"
                  @update:modelValue="updateVat"
                />
                
                <div class="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded-md shadow-sm">
                  <div class="text-sm flex justify-between mb-1">
                    <span class="text-gray-600 dark:text-gray-300">Pris ekskl. moms:</span>
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatPrice(formData.price) }} kr.</span>
                  </div>
                  <div class="text-sm flex justify-between mb-1">
                    <span class="text-gray-600 dark:text-gray-300">Moms ({{ formData.vat }}%):</span>
                    <span class="font-medium text-gray-700 dark:text-gray-300">{{ formatPrice(calculateVatAmount()) }} kr.</span>
                  </div>
                  <div class="text-sm flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600">
                    <span class="text-gray-600 dark:text-gray-300">Pris inkl. moms:</span>
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatPrice(calculatePriceWithVat()) }} kr.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Panel header="Produkt kategorisering" toggleable class="mt-3">
            <div class="grid grid-cols-1 gap-4">
              <FormInputField
                id="product-tag-name"
                v-model="formData.tag_name"
                label="Tag Navn"
                placeholder="f.eks. 'Kaffe', 'Mad', etc."
                :error="errors.tag_name"
                helpText="Valgfri kategori til produktet"
              />
              
              <FormColorPickerField
                id="product-tag-color"
                v-model="formData.tag_color"
                label="Tag Farve"
                defaultColor="#6466f1"
                :error="errors.tag_color"
                helpText="Vælg en farve til kategorien"
              />
            </div>
          </Panel>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button 
            type="button" 
            label="Annuller" 
            icon="pi pi-times" 
            class="p-button-secondary" 
            outlined 
            @click="$emit('cancel')" 
          />
          <Button 
            type="submit" 
            :label="submitLabel" 
            icon="pi pi-check" 
            :loading="loading" 
          />
        </div>
      </template>
    </Card>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits, onMounted, computed } from 'vue';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import FormInputField from '../form/FormInputField.vue';
import FormTextareaField from '../form/FormTextareaField.vue';
import FormNumberField from '../form/FormNumberField.vue';
import FormColorPickerField from '../form/FormColorPickerField.vue';
import type { ProductFormData } from '@/types/Product';

const props = defineProps<{
  initialData?: ProductFormData;
  title: string;
  submitLabel: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: ProductFormData): void;
  (e: 'cancel'): void;
}>();

// Form validation errors
const errors = reactive({
  name: '',
  description: '',
  price: '',
  vat: '',
  tag_name: '',
  tag_color: ''
});

// Default form data
const defaultFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  vat: 25, // Default VAT in Denmark
  tag_name: '',
  tag_color: '#6466f1', // Default to a nice blue color
};

// Initialize form data with provided data or defaults
const formData = reactive({ ...defaultFormData, ...props.initialData }) as Record<keyof ProductFormData, any>;


// Price mode - controls whether we display price with or without VAT
const priceMode = ref<'withVat' | 'withoutVat'>('withoutVat');

// Calculate the displayed price based on current mode
const displayPrice = computed({
  get: () => {
    if (priceMode.value === 'withVat') {
      return calculatePriceWithVat();
    } else {
      return formData.price;
    }
  },
  set: () => {
    // This will be handled by updatePrice method
  }
});

// Toggle between price with VAT and price without VAT
const togglePriceMode = () => {
  priceMode.value = priceMode.value === 'withVat' ? 'withoutVat' : 'withVat';
};

// Calculate price with VAT
const calculatePriceWithVat = (): number => {
  return formData.price * (1 + formData.vat / 100);
};

// Calculate VAT amount
const calculateVatAmount = (): number => {
  return formData.price * (formData.vat / 100);
};

// Update price when the user changes the displayed price
const updatePrice = (value: number) => {
  if (priceMode.value === 'withVat') {
    // If we're in 'with VAT' mode, calculate the price without VAT
    formData.price = value / (1 + formData.vat / 100);
  } else {
    // If we're in 'without VAT' mode, just update the price directly
    formData.price = value;
  }
};

// Update calculations when VAT changes
const updateVat = (value: number) => {
  formData.vat = value;
  // No need to update price here as the price without VAT doesn't change when VAT rate changes
};

// Format price for display
const formatPrice = (price: number): string => {
  return price.toFixed(2).replace('.', ',');
};

// Watch for initial data changes (useful for editing scenarios)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      (Object.keys(newData) as Array<keyof ProductFormData>).forEach((key) => {
        formData[key] = newData[key];
      });
    }
  },
  { immediate: true }
);


// Validate the form
const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
  
  // Validate required fields
  if (!formData.name.trim()) {
    errors.name = 'Produktnavn er påkrævet';
    isValid = false;
  }
  
  if (formData.price < 0) {
    errors.price = 'Pris kan ikke være negativ';
    isValid = false;
  }
  
  if (formData.vat < 0 || formData.vat > 100) {
    errors.vat = 'Momssats skal være mellem 0 og 100';
    isValid = false;
  }
  
  return isValid;
};

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...formData });
  }
};

// Apply dark mode style fixes on mount
onMounted(() => {
  // Direct DOM manipulation to fix dark mode styling if CSS doesn't work
  const applyDarkModeStyles = () => {
    if (document.documentElement.classList.contains('dark')) {
      // Find all input elements within this component
      setTimeout(() => {
        const priceInput = document.getElementById('product-price')?.querySelector('input');
        const vatInput = document.getElementById('product-vat')?.querySelector('input');
        
        if (priceInput) {
          priceInput.style.color = 'white';
          priceInput.style.backgroundColor = '#1e293b';
        }
        
        if (vatInput) {
          vatInput.style.color = 'white';
          vatInput.style.backgroundColor = '#1e293b';
        }
      }, 100);
    }
  };
  
  // Apply immediately
  applyDarkModeStyles();
  
  // Also apply when theme changes
  document.addEventListener('themeChanged', applyDarkModeStyles);
});
</script>

<style scoped>
.p-card {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.dark .p-card {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* Fix for dark mode number inputs */
:deep(#product-price .p-inputnumber-input),
:deep(#product-vat .p-inputnumber-input) {
  background-color: transparent !important;
}

.dark :deep(#product-price .p-inputnumber-input),
.dark :deep(#product-vat .p-inputnumber-input) {
  color: white !important;
  background-color: #1e293b !important;
}

:deep(.p-inputnumber-input),
:deep(.p-inputtext),
:deep(.p-textarea) {
  color: #000 !important; 
}

.dark :deep(.p-inputnumber-input),
.dark :deep(.p-inputtext),
.dark :deep(.p-textarea) {
  color: white !important; 
  background-color: #1e293b !important;
}
</style> 