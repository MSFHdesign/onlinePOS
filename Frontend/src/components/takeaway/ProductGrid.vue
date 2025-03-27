<template>
  <div class="flex flex-col h-full">
    <!-- Search & Sort Controls -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
          <i class="pi" :class="isSearching ? 'pi-spin pi-spinner' : 'pi-search'"></i>
        </span>
        <input
          type="text"
          placeholder="Søg efter produkter..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
                 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
          v-model="searchQuery"
        />
      </div>
      
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600 dark:text-gray-300">Sortér efter:</label>
        <select 
          v-model="sortBy"
          class="border border-gray-300 dark:border-gray-600 rounded-md 
                 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
                 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark
                 px-3 py-2"
        >
          <option value="name">Navn</option>
          <option value="price_asc">Pris (lav til høj)</option>
          <option value="price_desc">Pris (høj til lav)</option>
        </select>
      </div>
    </div>
    
    <!-- Product Filter Results Status -->
    <div v-if="searchQuery.trim() || props.selectedCategory !== 'all'" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      <span v-if="filteredProducts.length > 0" class="animate-fade-in">
        Viser {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'produkt' : 'produkter' }}
        {{ props.selectedCategory !== 'all' ? `i kategorien "${props.selectedCategory}"` : '' }}
        {{ searchQuery.trim() ? `med søgeordet "${searchQuery}"` : '' }}
      </span>
      <button 
        @click="clearFilters" 
        class="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <i class="pi pi-times-circle mr-1"></i>Ryd filter
      </button>
    </div>
    
    <!-- Product Grid Container with fixed height -->
    <div class="product-grid-container relative flex-grow">
      <!-- Loading State with Skeleton - Absolute positioning to not affect layout -->
      <div v-if="isSearching" class="absolute inset-0 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div v-for="n in 6" :key="n" class="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md h-[380px]">
          <div class="h-48 bg-gray-200 dark:bg-slate-700"></div>
          <div class="p-4">
            <div class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-6"></div>
            <div class="flex justify-between items-center">
              <div class="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div class="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Results Message - Absolute positioning to not affect layout -->
      <div v-if="!isSearching && filteredProducts.length === 0" class="absolute inset-0 z-10 py-16 text-center animate-fade-in flex flex-col items-center justify-center">
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
      
      <!-- Product Grid with consistent sizing - Always rendered but hidden when needed -->
      <div 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in h-full"
        :class="{ 'opacity-0': isSearching || filteredProducts.length === 0 }"
      >
        <!-- Empty placeholder cards when no results to maintain grid height -->
        <template v-if="filteredProducts.length === 0">
          <div v-for="n in 6" :key="`empty-${n}`" class="h-full invisible">
            <div class="h-full opacity-0"></div>
          </div>
        </template>
        
        <!-- Actual products -->
        <div v-else v-for="product in filteredProducts" :key="product.id" class="h-full product-item">
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
}>();

defineEmits<{
  (e: 'add-to-cart', product: Product): void;
}>();

const searchQuery = ref('');
const sortBy = ref('name');
const isSearching = ref(false);

// Add debouncing for search to prevent UI jitter
let searchTimeout: any = null;

watch([searchQuery, sortBy], () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  isSearching.value = true;
  
  searchTimeout = setTimeout(() => {
    isSearching.value = false;
  }, 500); // Slightly longer delay for better UX
});

// When category changes, we want to update immediately without loading state
watch(() => props.selectedCategory, () => {
  searchQuery.value = ''; // Clear search when changing categories
});

// Clear all filters and search
const clearFilters = () => {
  searchQuery.value = '';
  // Emit a custom event to reset category in parent
  emitCategoryReset();
};

// Function to emit the category reset event
const emitCategoryReset = () => {
  // This assumes your TakeAwayView is listening for this event
  // You may need to update the parent component
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
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) || 
      (product.description && product.description.toLowerCase().includes(query))
    );
  }
  
  // Sort products
  result.sort((a, b) => {
    switch (sortBy.value) {
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
  
  return result;
});
</script>

<style scoped>
.product-grid-container {
  transition: all 0.3s ease-in-out;
  will-change: contents;
  min-height: 400px; /* Ensure minimum height even when empty */
  position: relative;
  /* Use transform for better performance */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.product-item {
  transition: all 0.3s ease;
  animation: fadeIn 0.4s ease-out;
  will-change: transform, opacity;
  backface-visibility: hidden;
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
  will-change: transform, opacity;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out forwards;
  will-change: opacity;
}

/* Ensure fixed height grid items */
.grid {
  grid-template-rows: minmax(380px, 1fr);
}

/* Force hardware acceleration for smoother animations */
.absolute, .grid, .product-item {
  transform: translateZ(0);
}
</style> 