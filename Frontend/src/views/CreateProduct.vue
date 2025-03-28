<template>
  <div class="p-4 max-w-4xl mx-auto">
    <!-- Header Section -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-5 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <i class="pi pi-plus-circle text-primary-light dark:text-primary-dark"></i>
            Opret produkt
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Udfyld produktoplysninger nedenfor for at oprette et nyt produkt
          </p>
        </div>
        <Button 
          icon="pi pi-arrow-left" 
          label="Tilbage" 
          outlined 
          class="w-full sm:w-auto" 
          @click="goBack"
        />
      </div>
    </div>
    
    <!-- Product Info Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-5 mb-6">
      <div class="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="rounded-full bg-indigo-100 dark:bg-indigo-900 w-10 h-10 flex items-center justify-center flex-shrink-0">
          <i class="pi pi-info-circle text-primary-light dark:text-primary-dark"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Produktoplysninger</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Udfyld oplysningerne nedenfor for at oprette et nyt produkt. Felter markeret med * er påkrævede.
          </p>
        </div>
      </div>
      
      <!-- Form Section -->
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
    
    <!-- Toast for notifications -->
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ToastNotification from '@/components/feedback/ToastNotification.vue'
import ProductForm from '@/components/product/ProductForm.vue'
import type { ProductFormData } from '@/types/Product'
import { useProduct } from '@/composables/useProduct'

const router = useRouter()
const showNotification = inject<any>('showNotification')
const { createProduct, loading } = useProduct()
const isSubmitting = ref(false)

const goBack = () => {
  router.push('/')
}

const handleSubmit = async (productData: ProductFormData) => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  
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
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Any component-specific styles would go here */
</style>
