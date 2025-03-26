<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Produkter</h2>
      <RouterLink to="/create">
        <Button label="Opret nyt" icon="pi pi-plus" />
      </RouterLink>
    </div>

    <DataTable :value="products" class="w-full">
      <Column field="name" header="Navn" />
      <Column field="description" header="Beskrivelse" />
      <Column field="price" header="Pris" />
      <Column field="vat" header="Moms" />
      <Column field="tag_name" header="Tag" />
      <Column field="tag_color" header="Farve">
        <template #body="{ data }">
          <span :style="{ backgroundColor: data.tag_color }" class="inline-block w-6 h-6 rounded-full" />
        </template>
      </Column>
      <Column header="Handlinger">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" class="p-button-sm p-button-info" @click="editProduct(data)" />
            <Button icon="pi pi-trash" class="p-button-sm p-button-danger" @click="confirmDelete(data)" />
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
  price: number;
  vat: number;
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
