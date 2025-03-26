<template>
  <div class="p-4 max-w-4xl mx-auto">
    <!-- Page Header -->
    <div class="mb-4">
      <Breadcrumb :model="breadcrumbItems" class="mb-3" />
      <div class="flex align-items-center justify-content-between">
        <h1 class="text-3xl font-bold m-0">
          <i class="pi pi-plus-circle mr-2 text-primary-light dark:text-primary-dark"></i>
          Opret Nyt Produkt
        </h1>
        <Button icon="pi pi-arrow-left" label="Tilbage" outlined @click="goBack" />
      </div>
    </div>
    
    <!-- Toast for notifications -->
    <ToastNotification />
    
    <!-- Main Form Section --> 
    <div class="mt-4">
      <ProductForm
        title="Produkt Information"
        submitLabel="Gem Produkt"
        :loading="loading"
        @submit="createProduct"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import ToastNotification from '@/components/feedback/ToastNotification.vue';
import ProductForm from '@/components/product/ProductForm.vue';
import type { ProductFormData } from '@/types/Product';

const router = useRouter();
const loading = ref(false);

// Get the notification function from the provider
const showNotification = inject<any>('showNotification');

// Setup breadcrumb navigation
const breadcrumbItems = [
  { label: 'Hjem', to: '/' },
  { label: 'Produkter', to: '/' },
  { label: 'Opret produkt' }
];

// Navigation back to product list
const goBack = () => {
  router.push('/');
};

// Create new product
const createProduct = async (productData: ProductFormData) => {
  try {
    loading.value = true;
    const response = await axios.post('/api/products', productData);
    
    if (showNotification) {
      showNotification(
        'success',
        'Produkt Oprettet',
        `${productData.name} er blevet oprettet succesfuldt.`
      );
    }
    
    router.push('/');
  } catch (error: any) {
    console.error('Fejl ved oprettelse:', error);
    
    if (showNotification) {
      showNotification(
        'error',
        'Oprettelsesfejl',
        error.response?.data?.message || 'Der skete en fejl ved oprettelse af produktet',
        5000
      );
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Component-specific styles */
</style>
