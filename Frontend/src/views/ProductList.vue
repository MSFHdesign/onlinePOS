<template>
  <div class="p-4 max-w-5xl mx-auto">
    <div class="mb-4 bg-white dark:bg-slate-800 rounded-lg shadow p-5">
      <h2 class="text-lg font-bold text-gray-700 dark:text-white">
        Alle produkter ({{ items.length }})
      </h2>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="product-table w-full border-collapse min-w-[750px]">
          <thead>
            <tr>
              <th class="w-12"></th>
              <th class="w-20">ID</th>
              <th class="w-1/5">Navn</th>
              <th class="w-2/5">Beskrivelse</th>
              <th class="w-20">Pris</th>
              <th class="w-20">Moms</th>
              <th class="w-28">Tag</th>
              <th class="w-12"></th>
            </tr>
          </thead>
          <draggable
            tag="tbody"
            v-model="items"
            item-key="id"
            handle=".drag-handle"
            @end="updateOrder"
          >
            <template #item="{ element }">
              <tr>
                <td>
                  <div class="drag-handle flex items-center justify-center cursor-move opacity-50">
                    <span class="pi pi-bars"></span>
                  </div>
                </td>
                <td>{{ element.id }}</td>
                <td class="truncate max-w-[150px]" :title="element.name">{{ element.name }}</td>
                <td class="truncate max-w-[250px]" :title="element.description">{{ element.description }}</td>
                <td>{{ formatPrice(element.price) }}</td>
                <td>{{ parseFloat(element.vat) }} %</td>
                <td>
                  <div
                    v-if="element.tag_name"
                    class="tag-pill truncate max-w-[100px]"
                    :style="{
                      backgroundColor: element.tag_color,
                      color: getContrastColor(element.tag_color)
                    }"
                    :title="element.tag_name"
                  >
                    {{ element.tag_name }}
                  </div>
                  <span v-else>-</span>
                </td>
                <td>
                  <RouterLink :to="`/admin/product/${element.id}`">
                    <span class="pi pi-chevron-right text-gray-400"></span>
                  </RouterLink>
                </td>
              </tr>
            </template>
          </draggable>
        </table>
      </div>
    </div>

    <div class="flex justify-end mt-4">
      <RouterLink to="/admin/create">
        <Button label="Opret nyt produkt" icon="pi pi-plus" class="p-button-success" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/Product'
import { useSortableList } from '@/composables/useSortableList'
import draggable from 'vuedraggable'
import { useApi } from '@/composables/useApi'

const { get } = useApi()
const router = useRouter()

const { items, updateOrder } = useSortableList<Product>('/products/sort')

const fetchProducts = async () => {
  try {
    const res = await get('/products')
    items.value = res // brug items direkte
  } catch (err) {
    console.error('Fejl ved hentning:', err)
  }
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2).replace('.', ',')
}

const getContrastColor = (hexColor: string | null): string => {
  if (!hexColor) return '#000000'
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

onMounted(fetchProducts)
</script>

<style scoped>
.product-table th {
  @apply font-medium text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 px-4 py-2.5 border-b-2 border-gray-200;
}

.product-table td {
  @apply px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700;
}

.product-table tr:last-child td {
  @apply border-b-0;
}

.product-table tr:hover {
  @apply bg-gray-50 dark:bg-slate-700;
}

.tag-pill {
  @apply inline-block px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.pi-chevron-right {
  @apply transition-colors;
}

.pi-chevron-right:hover {
  @apply text-blue-500;
}

.drag-handle {
  @apply cursor-move;
}

.truncate {
  @apply overflow-hidden text-ellipsis whitespace-nowrap;
}
</style>
