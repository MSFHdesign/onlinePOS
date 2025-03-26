<template>
  <div class="p-4 max-w-5xl mx-auto">
    <div class="mb-4 bg-white dark:bg-slate-800 rounded-lg shadow p-5">
      <h2 class="text-lg font-bold text-gray-700 dark:text-white">Alle produkter ({{ products.length }})</h2>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <DataTable 
        :value="products" 
        class="product-table w-full" 
        stripedRows
        :paginator="false"
      >
        <Column :style="{ width: '50px' }">
          <template #body>
            <div class="flex items-center justify-center cursor-move opacity-50">
              <span class="pi pi-bars"></span>
            </div>
          </template>
        </Column>
        <Column field="id" header="Produkt ID" :sortable="false" :style="{ width: '120px' }" />
        <Column field="name" header="Navn" :sortable="false" />
        <Column field="description" header="Beskrivelse" :sortable="false" />
        <Column header="Pris" :sortable="false" :style="{ width: '80px' }">
          <template #body="{ data }">
            {{ formatPrice(data.price) }}
          </template>
        </Column>
        <Column header="Momssats" :sortable="false" :style="{ width: '100px' }">
          <template #body="{ data }">
            {{ parseFloat(data.vat) }} %
          </template>
        </Column>
        <Column field="tag_name" header="Tag" :sortable="false" :style="{ width: '120px' }">
          <template #body="{ data }">
            <div 
              v-if="data.tag_name" 
              class="tag-pill" 
              :style="{ 
                backgroundColor: data.tag_color, 
                color: getContrastColor(data.tag_color) 
              }"
            >
              {{ data.tag_name }}
            </div>
            <span v-else>-</span>
          </template>
        </Column>
        <Column :style="{ width: '50px' }">
          <template #body="{ data }">
            <RouterLink :to="`/product/${data.id}`">
              <span class="pi pi-chevron-right text-gray-400"></span>
            </RouterLink>
          </template>
        </Column>
      </DataTable>
    </div>

    <div class="flex justify-end mt-4">
      <RouterLink to="/create">
        <Button label="Opret nyt produkt" icon="pi pi-plus" class="p-button-success" />
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string | number;
  vat: string | number;
  tag_name: string | null;
  tag_color: string | null;
  sort_order: number;
}

const router = useRouter()
const products = ref<Product[]>([])

const fetchProducts = async () => {
  try {
    const res = await axios.get('/api/products')
    products.value = res.data
  } catch (error) {
    console.error('Fejl ved hentning:', error)
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

// Calculate contrast color for text based on background color
const getContrastColor = (hexColor: string | null): string => {
  if (!hexColor) return '#000000' // Default to black
  
  // Remove the # if present
  const hex = hexColor.replace('#', '')
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF' // Use black for light backgrounds, white for dark
}

onMounted(fetchProducts)
</script>

<style scoped>
.product-table {
  @apply border-collapse;
}

.product-table .p-datatable-thead > tr > th {
  @apply font-medium text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 px-4 py-2.5 border-b-2 border-gray-200;
}

.product-table .p-datatable-tbody > tr > td {
  @apply px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700;
}

.product-table .p-datatable-tbody > tr:last-child > td {
  @apply border-b-0;
}

.product-table .p-datatable-tbody > tr:hover {
  @apply bg-gray-50 dark:bg-slate-700;
}

/* Tag styling */
.tag-pill {
  @apply inline-block px-2.5 py-0.5 rounded-full text-xs font-medium;
}

/* Reset PrimeVue table styling */
:deep(.p-datatable-wrapper) {
  @apply border-none;
}

:deep(.p-datatable-table) {
  @apply border-collapse;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  @apply border-0 border-b border-gray-100;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  @apply border-0 border-b-2 border-gray-200;
}

/* Adjust hover states to match design */
.pi-chevron-right {
  @apply transition-colors;
}

.pi-chevron-right:hover {
  @apply text-blue-500;
}

/* Ensure clean spacing between rows */
:deep(.p-datatable .p-datatable-tbody > tr) {
  height: 50px;
}
</style>
