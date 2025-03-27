<template>
  <div class="flex flex-col h-full">
    <!-- Product Grid Container -->
    <div class="product-grid-container relative">
      <!-- Loading State with Skeleton -->
      <div v-if="isSearching" class="absolute inset-0 z-10 grid-skeleton animate-pulse">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-description"></div>
            <div class="skeleton-description-short"></div>
            <div class="skeleton-action">
              <div class="skeleton-price"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Results Message - Absolute positioning to not affect layout -->
      <div v-if="!isSearching && filteredProducts.length === 0" class="absolute inset-0 z-10 empty-state flex flex-col items-center justify-center">
        <i class="pi pi-inbox text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Ingen produkter fundet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Prøv at ændre din søgning eller vælg en anden kategori
        </p>
        <button 
          @click="clearFilters" 
          class="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
        >
          <i class="pi pi-refresh mr-2"></i>Vis alle produkter
        </button>
      </div>
      
      <!-- Product Grid -->
      <div 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
        :class="{ 'opacity-0': isSearching || filteredProducts.length === 0 }"
      >
        <!-- Empty placeholder cards when no results -->
        <template v-if="filteredProducts.length === 0">
          <div v-for="n in 6" :key="`empty-${n}`" class="grid-item invisible">
            <div class="opacity-0" style="height: 380px;"></div>
          </div>
        </template>
        
        <!-- Actual products -->
        <div v-else v-for="product in filteredProducts" :key="product.id" class="grid-item">
          <ProductCard 
            :product="product"
            @add-to-cart="$emit('add-to-cart', product)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import ProductCard from './ProductCard.vue';
import type { Product } from '@/types/Product';

const props = defineProps<{
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void;
  (e: 'update:filteredCount', count: number): void;
}>();

const isSearching = ref(false);

// Add debouncing for search to prevent UI jitter
let searchTimeout: any = null;

watch([() => props.searchQuery, () => props.sortBy], () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  isSearching.value = true;
  
  searchTimeout = setTimeout(() => {
    isSearching.value = false;
  }, 500); // Slightly longer delay for better UX
});

// Clear all filters and search
const clearFilters = () => {
  // Emit a custom event to reset category in parent
  emitCategoryReset();
};

// Function to emit the category reset event
const emitCategoryReset = () => {
  const event = new CustomEvent('reset-category', { 
    bubbles: true,
    composed: true 
  });
  document.dispatchEvent(event);
};

const filteredProducts = computed(() => {
  let result = [...props.products];
  
  // Filter by category
  if (props.selectedCategory !== 'all') {
    result = result.filter(product => product.tag_name === props.selectedCategory);
  }
  
  // Filter by search query
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) || 
      (product.description && product.description.toLowerCase().includes(query))
    );
  }
  
  // Sort products
  result.sort((a, b) => {
    switch (props.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price_asc':
        return Number(a.price) - Number(b.price);
      case 'price_desc':
        return Number(b.price) - Number(a.price);
      default:
        return 0;
    }
  });
  
  // Emit the filtered count to parent
  emit('update:filteredCount', result.length);
  
  return result;
});
</script>

<style scoped>
.product-grid-container {
  position: relative;
  min-height: 400px;
}

.product-item {
  transition: all 0.3s ease;
}

.grid-item {
  min-height: 380px;
  width: 100%;
  position: relative;
}

/* Ensure grid-skeleton matches grid dimensions */
.grid-skeleton {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  width: 100%;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
  will-change: transform, opacity;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out forwards;
  will-change: opacity;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Ensure fixed height grid items */
.grid {
  grid-template-rows: minmax(380px, 380px); /* Fixed exact height */
}

/* Force hardware acceleration for smoother animations */
.absolute, .grid, .product-item, .grid-item {
  transform: translateZ(0);
}

/* Skeleton loading styling with exact dimensions */
.grid-skeleton {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-auto-rows: 380px;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
  contain: strict;
}

@media (min-width: 640px) {
  .grid-skeleton {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-skeleton {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skeleton-card {
  height: 380px; /* Exact match to ProductCard */
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.dark .skeleton-card {
  background-color: rgb(30, 41, 59); /* slate-800 */
}

.skeleton-image {
  height: 192px; /* Exact match to ProductCard image */
  background-color: rgb(229, 231, 235); /* gray-200 */
  flex-shrink: 0;
}

.dark .skeleton-image {
  background-color: rgb(51, 65, 85); /* slate-700 */
}

.skeleton-content {
  height: 188px; /* Exact match to ProductCard content */
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.skeleton-title {
  height: 24px;
  width: 75%;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  background-color: rgb(229, 231, 235); /* gray-200 */
}

.dark .skeleton-title {
  background-color: rgb(51, 65, 85); /* slate-700 */
}

.skeleton-description, .skeleton-description-short {
  height: 16px;
  border-radius: 0.25rem;
  background-color: rgb(229, 231, 235); /* gray-200 */
  margin-bottom: 0.5rem;
}

.skeleton-description {
  width: 100%;
}

.skeleton-description-short {
  width: 66%;
}

.dark .skeleton-description, .dark .skeleton-description-short {
  background-color: rgb(51, 65, 85); /* slate-700 */
}

.skeleton-action {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
}

.skeleton-price {
  height: 24px;
  width: 64px;
  border-radius: 0.25rem;
  background-color: rgb(229, 231, 235); /* gray-200 */
}

.dark .skeleton-price {
  background-color: rgb(51, 65, 85); /* slate-700 */
}

.skeleton-button {
  height: 32px;
  width: 32px;
  border-radius: 9999px;
  background-color: rgb(229, 231, 235); /* gray-200 */
}

.dark .skeleton-button {
  background-color: rgb(51, 65, 85); /* slate-700 */
}

/* Empty state styling */
.empty-state {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  contain: strict;
}

.dark .empty-state {
  background-color: rgba(15, 23, 42, 0.9); /* slate-900 at 90% opacity */
}
</style> 