<template>
  <div class="overflow-x-auto">
    <table class="product-table w-full border-collapse min-w-[750px]">
      <thead>
        <tr>
          <th class="w-12"></th>
          <th class="w-20">ID</th>
          <th class="w-1/5">Navn</th>
          <th class="w-2/5 hidden md:table-cell">Beskrivelse</th>
          <th class="w-20">Pris</th>
          <th class="w-20 hidden sm:table-cell">Moms</th>
          <th class="w-28 hidden sm:table-cell">Tag</th>
          <th class="w-12"></th>
        </tr>
      </thead>
      <draggable
        tag="tbody"
        v-model="products"
        item-key="id"
        handle=".drag-handle"
        @end="onOrderUpdate"
      >
        <template #item="{ element, index }">
          <tr 
            :class="{ 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600': true, 'featured-product': isFeatured(element, index) }" 
            @click="onRowClick($event, element)"
          >
            <td @click.stop>
              <div class="drag-handle flex items-center justify-center cursor-move opacity-50">
                <span class="pi pi-bars"></span>
              </div>
            </td>
            <td class="relative">
              {{ element.id }}
              <span v-if="isFeatured(element, index)" class="featured-star">
                <i class="pi pi-star-fill text-yellow-400" title="Featured product"></i>
              </span>
            </td>
            <td class="truncate max-w-[150px]" :title="element.name">{{ element.name }}</td>
            <td class="truncate max-w-[250px] hidden md:table-cell" :title="element.description">
              {{ element.description }}
            </td>
            <td>{{ formatPrice(element.price) }}</td>
            <td class="hidden sm:table-cell">{{ parseFloat(element.vat) }} %</td>
            <td class="hidden sm:table-cell">
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
            <td @click.stop>
              <RouterLink :to="`/admin/product/${element.id}`">
                <span class="pi pi-chevron-right text-gray-400"></span>
              </RouterLink>
            </td>
          </tr>
        </template>
      </draggable>
    </table>
  </div>

  <!-- Quick Edit Modal -->
  <QuickEditModal
    v-model="showQuickEditModal"
    :product="selectedProduct"
    @product-updated="onProductUpdated"
    @close="onModalClose"
    @cancel="onModalCancel"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types/Product'
import draggable from 'vuedraggable'
import { useContrastColor } from '@/composables/useContrastColor'
import QuickEditModal from '@/components/product/QuickEditModal.vue'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  (e: 'update:products', products: Product[]): void
  (e: 'order-updated'): void
  (e: 'product-updated', product: Product): void
  (e: 'modal-closed', reason: string): void
  (e: 'featured-product'): void
}>()

const { getContrastColor } = useContrastColor()

// Quick edit modal state
const showQuickEditModal = ref(false)
const selectedProduct = ref<Product | null>(null)

// Computed property for the products array that emits an update when changed
const products = computed({
  get: () => props.products,
  set: (value) => emit('update:products', value)
})

// Check if a product is featured (first by sort_order)
const isFeatured = (product: Product, index: number): boolean => {
  if (products.value.length === 0) return false
  
  // In the products view, the first item in the array is always 
  // the first one visually, since they're sorted in the UI
  return index === 0
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2).replace('.', ',')
}

const onOrderUpdate = () => {
  // Update local sort_order values to match the new visual order
  const updatedProducts = [...products.value].map((product, index) => ({
    ...product,
    sort_order: index
  }))
  
  // Update the products array
  emit('update:products', updatedProducts)
  
  // Notify parent about the order change
  emit('order-updated')
}

const onRowClick = (event: MouseEvent, product: Product) => {
  // Don't trigger on icon click (which has its own handler)
  if (event.target && (event.target as HTMLElement).closest('.pi-chevron-right')) {
    return
  }
  
  // Don't trigger on drag handle
  if (event.target && (event.target as HTMLElement).closest('.drag-handle')) {
    return
  }
  
  selectedProduct.value = product
  showQuickEditModal.value = true
}

const onProductUpdated = (updatedProduct: Product) => {
  // Find the product in the array and update it
  const index = products.value.findIndex(p => p.id === updatedProduct.id)
  if (index !== -1) {
    const updatedProducts = [...products.value]
    updatedProducts[index] = updatedProduct
    emit('update:products', updatedProducts)
  }
  
  // Emit event to parent for API update if needed
  emit('product-updated', updatedProduct)
}

const onModalClose = (reason: string) => {
  // Just pass through the close reason
  emit('modal-closed', reason);
}

const onModalCancel = () => {
  // Explicit cancel event
  emit('modal-closed', 'canceled');
}
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

.product-table tr.cursor-pointer:hover {
  @apply bg-gray-100 dark:bg-slate-600 transition-colors duration-150;
}

.product-table tr.cursor-pointer td:not(:first-child):not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  @apply bg-gray-100/0 dark:bg-slate-600/0 transition-colors duration-150;
}

.product-table tr.cursor-pointer td {
  position: relative;
}

.featured-product {
  @apply bg-yellow-50 dark:bg-yellow-900/20;
}

.featured-product:hover {
  @apply bg-yellow-100 dark:bg-yellow-900/30 !important;
}

.featured-star {
  @apply absolute -top-1 -right-1;
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

/* Mobile-specific styles */
@media (max-width: 640px) {
  .product-table {
    @apply min-w-full;
  }
}
</style> 