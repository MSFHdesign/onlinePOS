<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Produkter</h2>
      <RouterLink to="/create">
        <Button label="Opret nyt" icon="pi pi-plus" />
      </RouterLink>
    </div>

    <DataTable :value="products" class="w-full" stripedRows>
      <Column field="name" header="Navn" />
      <Column field="description" header="Beskrivelse" />
      <Column header="Pris">
        <template #body="{ data }">
          {{ formatPrice(data.price) }} kr.
        </template>
      </Column>
      <Column header="Moms">
        <template #body="{ data }">
          {{ parseFloat(data.vat) }}%
        </template>
      </Column>
      <Column header="Pris inkl. moms">
        <template #body="{ data }">
          {{ formatPrice(calculatePriceWithVat(data.price, data.vat)) }} kr.
        </template>
      </Column>
      <Column field="tag_name" header="Tag" />
      <Column field="tag_color" header="Farve">
        <template #body="{ data }">
          <span 
            :style="{ backgroundColor: data.tag_color }" 
            class="inline-block w-6 h-6 rounded-full"
            :title="data.tag_color" 
          />
        </template>
      </Column>
      <Column header="Handlinger" :style="{ width: '220px' }">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" label="Rediger" class="p-button-sm p-button-info" @click="editProduct(data)" />
            <Button icon="pi pi-trash" label="Slet" class="p-button-sm p-button-danger" @click="confirmDelete(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:visible="deleteDialogVisible" header="Bekræft sletning" :style="{ width: '450px' }" :modal="true">
      <div class="p-4">
        <p>Er du sikker på at du vil slette <strong>{{ selectedProduct?.name }}</strong>?</p>
      </div>
      <template #footer>
        <Button label="Nej" icon="pi pi-times" class="p-button-text" @click="deleteDialogVisible = false" />
        <Button label="Ja" icon="pi pi-check" class="p-button-danger" @click="deleteProduct" />
      </template>
    </Dialog>
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
const deleteDialogVisible = ref(false)
const selectedProduct = ref<Product | null>(null)

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

const editProduct = (product: Product) => {
  router.push(`/edit/${product.id}`)
}

const confirmDelete = (product: Product) => {
  selectedProduct.value = product
  deleteDialogVisible.value = true
}

const deleteProduct = async () => {
  try {
    if (selectedProduct.value) {
      await axios.delete(`/api/products/${selectedProduct.value.id}`)
      deleteDialogVisible.value = false
      fetchProducts() // Refresh the list after deletion
    }
  } catch (error) {
    console.error('Fejl ved sletning:', error)
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
/* Add any component-specific styles here */
.p-datatable .p-datatable-thead > tr > th {
  @apply font-semibold bg-gray-50 dark:bg-slate-700;
}

.p-datatable .p-datatable-tbody > tr.p-datatable-row-odd {
  @apply bg-gray-50 dark:bg-slate-700/50;
}

.p-datatable .p-datatable-tbody > tr:hover {
  @apply bg-gray-100 dark:bg-slate-600;
}
</style>
