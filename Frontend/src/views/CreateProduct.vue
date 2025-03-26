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
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import ProductForm from '@/components/product/ProductForm.vue'
import type { ProductFormData } from '@/types/Product'
import { useProduct } from '@/composables/useProduct'

const router = useRouter()
const showNotification = inject<any>('showNotification')

// Brug composable i stedet for axios direkte
const { createProduct, loading } = useProduct()

const breadcrumbItems = [
  { label: 'Hjem', to: '/' },
  { label: 'Produkter', to: '/' },
  { label: 'Opret produkt' }
]

const goBack = () => {
  router.push('/')
}

const handleSubmit = async (productData: ProductFormData) => {
  try {
    await createProduct(productData)

    if (showNotification) {
      showNotification(
        'success',
        'Produkt Oprettet',
        `${productData.name} er blevet oprettet succesfuldt.`
      )
    }

    setTimeout(() => {
      router.push('/')
    }, 300)
  } catch (error: any) {
    console.error('Fejl ved oprettelse:', error)

    if (showNotification) {
      showNotification(
        'error',
        'Oprettelsesfejl',
        error.response?.data?.message || 'Der skete en fejl ved oprettelse af produktet',
        5000
      )
    }
  }
}
</script>

<style scoped>
/* Component-specific styles */
</style>
