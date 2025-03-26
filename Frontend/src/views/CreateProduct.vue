<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Opret Produkt</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
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

      <Button type="submit" label="Gem produkt" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const product = ref({
  name: '',
  description: '',
  price: 0,
  vat: 0,
  tag_name: '',
  tag_color: '#000000',
})

const submitForm = async () => {
  try {
    await axios.post('/api/products', product.value)
    router.push('/')
  } catch (error) {
    console.error('Fejl ved oprettelse:', error)
  }
}
</script>
