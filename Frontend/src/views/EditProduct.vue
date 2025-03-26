<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Rediger Produkt</h2>
    <div v-if="loading" class="text-center py-8">
      <p>Indlæser produkt...</p>
    </div>
    <form v-else @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block mb-1">Navn</label>
        <input v-model="product.name" type="text" class="p-inputtext w-full" required />
      </div>

      <div>
        <label class="block mb-1">Beskrivelse</label>
        <textarea v-model="product.description" class="p-inputtext w-full" />
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1">Pris</label>
          <input v-model.number="product.price" type="number" class="p-inputtext w-full" required />
        </div>
        <div class="flex-1">
          <label class="block mb-1">Moms</label>
          <input v-model.number="product.vat" type="number" class="p-inputtext w-full" required />
        </div>
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1">Tag Navn</label>
          <input v-model="product.tag_name" type="text" class="p-inputtext w-full" />
        </div>
        <div class="flex-1">
          <label class="block mb-1">Tag Farve</label>
          <input v-model="product.tag_color" type="color" class="p-inputtext w-full" />
        </div>
      </div>

      <div class="flex gap-2">
        <Button type="submit" label="Gem ændringer" />
        <Button type="button" label="Annuller" class="p-button-secondary" @click="router.push('/')" />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  vat: number;
  tag_name: string | null;
  tag_color: string | null;
  sort_order?: number;
}

const router = useRouter()
const route = useRoute()
const productId = route.params.id as string
const loading = ref(true)

// Default empty product
const product = ref<Product>({
  id: 0,
  name: '',
  description: '',
  price: 0,
  vat: 0,
  tag_name: '',
  tag_color: '#000000',
})

const fetchProduct = async () => {
  try {
    loading.value = true
    const res = await axios.get(`/api/products/${productId}`)
    product.value = res.data
  } catch (error) {
    console.error('Fejl ved hentning af produkt:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  try {
    await axios.put(`/api/products/${productId}`, product.value)
    router.push('/')
  } catch (error) {
    console.error('Fejl ved opdatering:', error)
  }
}

onMounted(fetchProduct)
</script> 