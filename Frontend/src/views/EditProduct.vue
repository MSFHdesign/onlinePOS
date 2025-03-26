<template>
  <div class="p-4 max-w-4xl mx-auto">
    <!-- Page Header -->
    <div class="mb-4">
      <Breadcrumb :model="breadcrumbItems" class="mb-3" />
      <div class="flex align-items-center justify-content-between">
        <h1 class="text-3xl font-bold m-0">
          <i class="pi pi-pencil mr-2 text-primary-light dark:text-primary-dark"></i>
          Rediger Produkt
        </h1>
        <Button icon="pi pi-arrow-left" label="Tilbage" outlined @click="goBack" />
      </div>
    </div>
    
    <!-- Toast for notifications -->
    <ToastNotification />
    
    <!-- Main Form Section --> 
    <div class="mt-4">
      <div v-if="loading" class="p-4 text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-light dark:text-primary-dark"></i>
        <p class="mt-2">Indlæser produkt...</p>
      </div>
     <ProductForm
  v-else
  title="Rediger Produkt Information"
  submitLabel="Gem Ændringer"
  :loading="saving"
  :initialData="product"
  @submit="submitForm"
  @cancel="goBack"
/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import ToastNotification from '@/components/feedback/ToastNotification.vue';
import ProductForm from '@/components/product/ProductForm.vue';
import type { ProductFormData } from '@/types/Product';
import { useApi } from '@/composables/useApi'

const router = useRouter();
const route = useRoute();
const productId = route.params.id as string;
const loading = ref(true);
const saving = ref(false);
const { get,put } = useApi()

// Get the notification function from the provider
const showNotification = inject<any>('showNotification');

// Setup breadcrumb navigation
const breadcrumbItems = [
  { label: 'Hjem', to: '/' },
  { label: 'Produkter', to: '/' },
  { label: 'Rediger produkt' }
];

// Navigation back to product list
const goBack = () => {
  router.push('/');
};

// Default empty product
const product = ref<ProductFormData>({
  name: '',
  description: '',
  price: 0,
  vat: 25,
  tag_name: '',
  tag_color: '#6466f1',
});

const fetchProduct = async () => {
  try {
    loading.value = true;
    const data = await get(`/products/${productId}`); 

    console.log('Produkt response:', data)

    product.value = {
      name: data.name,
      description: data.description ?? '',
      price: parseFloat(data.price), 
      vat: parseFloat(data.vat),     
      tag_name: data.tag_name ?? '',
      tag_color: data.tag_color ?? '#6466f1'
    };
  } catch (error: any) {
    console.error('Fejl ved hentning af produkt:', error)

    if (showNotification) {
      showNotification(
        'error',
        'Kunne ikke indlæse produkt',
        error.response?.data?.message || 'Der skete en fejl ved indlæsning af produktet',
        5000
      );
    }

    router.push('/');
  } finally {
    loading.value = false;
  }
};


const submitForm = async (productData: ProductFormData) => {
  try {
    saving.value = true;

    await put(`/products/${productId}`, productData); // Fjern /api

    if (showNotification) {
      showNotification(
        'success',
        'Produkt Opdateret',
        `${productData.name} er blevet opdateret succesfuldt.`,
        3000
      );
    }

    router.push('/');
  } catch (error: any) {
    console.error('Fejl ved opdatering:', error);

    if (showNotification) {
      showNotification(
        'error',
        'Opdateringsfejl',
        error.response?.data?.message || 'Der skete en fejl ved opdatering af produktet',
        5000
      );
    }
  } finally {
    saving.value = false;
  }
};

onMounted(fetchProduct);
</script>

<style scoped>
/* Component-specific styles */
</style> 