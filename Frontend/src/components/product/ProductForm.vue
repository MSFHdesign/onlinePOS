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
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormNumberField
              id="product-price"
              v-model="formData.price"
              label="Pris"
              placeholder="0.00"
              min="0"
              step="0.01"
              mode="decimal"
              suffix=" kr."
              required
              :error="errors.price"
              helpText="Indtast pris uden moms"
            />
            
            <FormNumberField
              id="product-vat"
              v-model="formData.vat"
              label="Moms"
              placeholder="25"
              min="0"
              max="100"
              suffix=" %"
              required
              :error="errors.vat"
              helpText="Standard momssats er 25%"
            />
          </div>
          
          <Panel header="Produkt kategorisering" toggleable class="mt-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
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
const formData = reactive<ProductFormData>({
  ...defaultFormData,
  ...props.initialData
});

// Watch for initial data changes (useful for editing scenarios)
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData, newData);
  }
}, { deep: true });

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
</script>

<style scoped>
.p-card {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.dark .p-card {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15);
}
</style> 