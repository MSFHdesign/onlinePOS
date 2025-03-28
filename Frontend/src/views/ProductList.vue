<template>
  <div class="p-4 max-w-5xl mx-auto">
    <!-- Header Section -->
    <div class="mb-4 bg-white dark:bg-slate-800 rounded-lg shadow p-5">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 class="text-lg font-bold text-gray-700 dark:text-white mb-1">
            Alle produkter <span v-if="!loading && !error">({{ products.length }})</span>
          </h2>
          <p v-if="!loading && !error && products.length > 0" class="text-sm text-gray-500 dark:text-gray-400">
            Tip: Klik på en række for hurtig redigering
          </p>
        </div>
        <div class="flex space-x-2 mt-2 sm:mt-0">
          <Button 
            label="Hurtig tilføj" 
            icon="pi pi-plus" 
            class="p-button-primary w-full sm:w-auto" 
            @click="showAddModal = true"
          />
          <RouterLink to="/admin/create">
            <Button label="Avanceret opret" icon="pi pi-cog" class="p-button-success w-full sm:w-auto" />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Loading State - Using Skeleton -->
    <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <ProductTableSkeleton />
    </div>

    <!-- Error State -->
    <ErrorMessage 
      v-else-if="error" 
      :message="error" 
      retry 
      retryText="Prøv igen"
      @retry="fetchProducts" 
    />

    <!-- Empty State -->
    <div 
      v-else-if="products.length === 0" 
      class="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center"
    >
      <span class="pi pi-inbox text-4xl text-gray-400 dark:text-gray-500 mb-4 block"></span>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Ingen produkter fundet</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Der er endnu ikke oprettet nogen produkter.</p>
      <div class="flex justify-center space-x-3">
        <Button label="Hurtig tilføj" icon="pi pi-plus" class="p-button-primary" @click="showAddModal = true" />
        <RouterLink to="/admin/create">
          <Button label="Avanceret opret" icon="pi pi-cog" class="p-button-success" />
        </RouterLink>
      </div>
    </div>

    <!-- Product Table -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <ProductTable 
        v-model:products="products" 
        @order-updated="updateOrder" 
        @product-updated="handleProductUpdated"
        @modal-closed="handleModalClosed"
      />
    </div>
  </div>
  
  <!-- Toast for notifications -->
  <Toast position="top-right" />
  
  <!-- Add Product Modal -->
  <AddProductModal
    v-model="showAddModal"
    @product-created="handleProductCreated"
    @close="handleAddModalClosed"
  />
</template>

<script setup lang="ts">
import { onMounted, inject, ref } from 'vue'
import { useProducts } from '@/composables/useProducts'
import ProductTable from '@/components/product/ProductTable.vue'
import ProductTableSkeleton from '@/components/product/ProductTableSkeleton.vue'
import ErrorMessage from '@/components/feedback/ErrorMessage.vue'
import AddProductModal from '@/components/product/AddProductModal.vue'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import type { Product } from '@/types/Product'

const toast = useToast()
const { products, loading, error, fetchProducts, updateProductOrder } = useProducts()
const showAddModal = ref(false)

const updateOrder = async () => {
  try {
    // Get array of product IDs for the backend
    const order = products.value.map((item) => item.id)
    
    // Update backend
    await updateProductOrder(order)
    
    // Force a re-fetch to ensure all data is consistent
    await fetchProducts()
    
    toast.add({
      severity: 'success',
      summary: 'Rækkefølge opdateret',
      detail: 'Produkternes rækkefølge er blevet gemt',
      life: 3000
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Fejl',
      detail: 'Der opstod en fejl ved opdatering af rækkefølgen',
      life: 5000
    })
  }
}

const handleProductUpdated = (updatedProduct: Product) => {
  toast.add({
    severity: 'success',
    summary: 'Produkt opdateret',
    detail: `${updatedProduct.name} er blevet opdateret`,
    life: 4000
  })
  
  // The actual update is already handled by the v-model binding
  // This is just for notification purposes
}

const handleProductCreated = (newProduct: Product) => {
  toast.add({
    severity: 'success',
    summary: 'Produkt oprettet',
    detail: `${newProduct.name} er blevet oprettet`,
    life: 4000
  })
  
  // Refresh product list to include the new product
  fetchProducts()
}

const handleAddModalClosed = (reason: string) => {
  if (reason === 'created') {
    // Already handled by handleProductCreated
  } else if (reason === 'canceled') {
    toast.add({
      severity: 'info',
      summary: 'Oprettelse annulleret',
      detail: 'Ingen produkter blev oprettet',
      life: 3000
    })
  }
}

const handleModalClosed = (reason: string) => {
  // Only show cancel toast when explicitly canceled
  if (reason === 'canceled') {
    toast.add({
      severity: 'info',
      summary: 'Redigering annulleret',
      detail: 'Ingen ændringer blev gemt',
      life: 3000
    })
  }
}

// For testing purposes - will be triggered once on mount
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Styles are now in the ProductTable component */
</style>
