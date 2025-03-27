<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <Button icon="pi pi-arrow-left" class="p-button-text" @click="router.back()" />
        <h2 class="text-2xl font-bold">Produkt detaljer</h2>
      </div>
      <div class="flex gap-2">
        <RouterLink :to="`/admin/edit/${product?.id}`">
          <Button icon="pi pi-pencil" label="Rediger" class="p-button-info" />
        </RouterLink>
         <Button 
    icon="pi pi-trash" 
    label="Slet" 
    class="p-button-danger" 
    @click="deleteProduct" 
  />
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      <ProgressSpinner />
      <p class="mt-2">Indlæser produkt...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
      <p class="text-red-700">{{ error }}</p>
    </div>
    
    <div v-else-if="product" class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left column - Basic info -->
        <div>
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">Basisoplysninger</h3>
            
            <div class="mb-3">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Produkt ID</p>
              <p class="font-medium">{{ product.id }}</p>
            </div>
            
            <div class="mb-3">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Navn</p>
              <p class="font-medium">{{ product.name }}</p>
            </div>
            
            <div class="mb-3">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Beskrivelse</p>
              <p class="font-medium">{{ product.description || 'Ingen beskrivelse' }}</p>
            </div>
            
            <div class="mb-3" v-if="product.tag_name">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Tag</p>
              <div class="flex items-center gap-2">
                <span 
                  :style="{ backgroundColor: product.tag_color }" 
                  class="inline-block w-4 h-4 rounded-full" 
                />
                <span>{{ product.tag_name }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right column - Price info -->
        <div>
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 border-b pb-2">Prisoplysninger</h3>
            
            <div class="mb-3">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Pris (ekskl. moms)</p>
              <p class="font-medium text-lg">{{ formatPrice(product.price) }} kr.</p>
            </div>
            
            <div class="mb-3">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Momssats</p>
              <p class="font-medium">{{ parseFloat(product.vat) }}%</p>
            </div>
            
            <div class="mb-3">
              <p class="text-gray-500 dark:text-gray-400 text-sm">Pris (inkl. moms)</p>
              <p class="font-medium text-xl text-green-600 dark:text-green-400">
                {{ formatPrice(calculatePriceWithVat(product.price, product.vat)) }} kr.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-10">
      <p>Produktet blev ikke fundet.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import type { Product } from '@/types/Product'
import { useApi } from '@/composables/useApi'

const { get, del } = useApi()
const router = useRouter()
const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const productId = route.params.id
    const data = await get(`/products/${productId}`)
    product.value = data
  } catch (err) {
    console.error('Fejl ved hentning af produkt:', err)
    error.value = 'Der opstod en fejl ved hentning af produktet. Prøv igen senere.'
  } finally {
    loading.value = false
  }
}
const deleteProduct = async () => {
  const confirmDelete = confirm('Er du sikker på, at du vil slette dette produkt?')

  if (!confirmDelete || !product.value?.id) return

  try {
    await del(`/products/${product.value.id}`)
    router.push('/')
  } catch (err) {
    console.error('Fejl ved sletning:', err)
    alert('Kunne ikke slette produktet. Prøv igen senere.')
  }
}
// Format price for display with Danish formatting
const formatPrice = (price: string | number): string => {
  // Convert string to number if needed
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2).replace('.', ',')
}

// Calculate price with VAT
const calculatePriceWithVat = (price: string | number, vat: string | number): number => {
  // Convert strings to numbers if needed
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  const numVat = typeof vat === 'string' ? parseFloat(vat) : vat
  return numPrice * (1 + numVat / 100)
}

onMounted(fetchProduct)
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 