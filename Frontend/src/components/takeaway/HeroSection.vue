<template>
  <div class="relative bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 rounded-lg overflow-hidden mb-10">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 pattern-background"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 px-6 py-10 md:py-16 md:px-10 max-w-5xl mx-auto text-white">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="mb-8 md:mb-0 md:pr-8 md:max-w-lg">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">OnlinePos Take Away</h1>
          <p class="text-indigo-100 dark:text-indigo-200 text-lg mb-6">
            Bestil mad og drikke nemt og hurtigt til afhentning. Vi har et stort udvalg af lækre produkter.
          </p>
          <div class="flex flex-wrap gap-3">
            <a href="#menu" class="inline-flex items-center bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-3 rounded-md font-medium transition-colors">
              <i class="pi pi-list mr-2"></i>
              Se menu
            </a>
            <a href="#" class="inline-flex items-center bg-indigo-800 bg-opacity-40 hover:bg-opacity-60 px-5 py-3 rounded-md font-medium transition-colors">
              <i class="pi pi-info-circle mr-2"></i>
              Om os
            </a>
          </div>
        </div>
        
        <!-- Featured Product -->
        <div v-if="!loading" class="hidden md:block">
          <FeaturedProduct 
            :product="featuredProduct" 
            @add-to-cart="addToCart"
          />
        </div>
        <div v-else class="hidden md:block h-64 w-64 flex items-center justify-center">
          <i class="pi pi-spin pi-spinner text-3xl"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import FeaturedProduct from '@/components/takeaway/FeaturedProduct.vue';
import { useProducts } from '@/composables/useProducts';
import { useToast } from 'primevue/usetoast';
import type { Product } from '@/types/Product';

const { loading, fetchFeaturedProduct } = useProducts();
const featuredProduct = ref<Product | null>(null);
let refreshInterval: number | null = null;
const toast = useToast();

// Define emits for cart functionality
const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>();

// Add to cart function
const addToCart = (product: Product) => {
  // Emit the event up to the parent component (TakeAwayView)
  emit('add-to-cart', product);
  
  // Show toast notification
  toast.add({ 
    severity: 'success', 
    summary: 'Tilføjet til kurv', 
    detail: `${product.name} er tilføjet til din kurv`, 
    life: 2000 
  });
};

// Load the featured product
const loadFeaturedProduct = async () => {
  try {
    // Fetch the featured product (first by sort_order)
    featuredProduct.value = await fetchFeaturedProduct();
  } catch (error) {
    console.error('Error loading featured product:', error);
  }
};

onMounted(async () => {
  await loadFeaturedProduct();
  
  // Set up a refresh interval to keep the featured product updated
  // This ensures that if someone changes the order in the admin view,
  // the featured product will update automatically
  refreshInterval = window.setInterval(loadFeaturedProduct, 60000); // Refresh every minute
});

onBeforeUnmount(() => {
  // Clear the interval when component is destroyed
  if (refreshInterval !== null) {
    window.clearInterval(refreshInterval);
  }
});

// Listen for custom event that could be emitted when product order changes
const handleOrderChanged = () => {
  loadFeaturedProduct();
};

// Create a custom event bus or use props to listen for order changes
</script>

<style scoped>
.pattern-background {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style> 