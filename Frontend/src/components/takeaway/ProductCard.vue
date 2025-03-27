<template>
  <div class="product-card bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
    <!-- Product Image - Fixed height to prevent layout shifts -->
    <div class="h-48 bg-gray-200 dark:bg-slate-700 relative flex-shrink-0 overflow-hidden">
      <img 
        v-if="product.image_url" 
        :src="product.image_url" 
        :alt="product.name" 
        class="w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <i class="pi pi-image text-5xl"></i>
      </div>
      
      <!-- Tag Badge (if present) -->
      <div 
        v-if="product.tag_name" 
        class="absolute top-3 right-3 tag-badge truncate max-w-[120px]" 
        :style="{ backgroundColor: product.tag_color, color: getContrastColor(product.tag_color) }"
        :title="product.tag_name"
      >
        {{ product.tag_name }}
      </div>
    </div>
    
    <!-- Product Info - Strict fixed min-height ensures consistent card sizes -->
    <div class="p-4 flex-grow flex flex-col min-h-[150px]" style="height: 200px;">
      <h3 class="text-lg font-semibold mb-1 text-gray-800 dark:text-white truncate" :title="product.name">{{ product.name }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow" :title="product.description">
        {{ product.description || 'Ingen beskrivelse tilgængelig' }}
      </p>
      
      <div class="flex justify-between items-center mt-auto">
        <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatPrice(product.price) }}</span>
        <button 
          @click="addToCart(product)"
          class="bg-primary-light dark:bg-primary-dark text-white rounded-full p-2 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-110"
          :title="`Tilføj ${product.name} til kurv`"
        >
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Product } from '@/types/Product';

const props = defineProps<{
  product: Product
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>();

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toFixed(2).replace('.', ',') + ' kr';
};

const getContrastColor = (hexColor: string | null): string => {
  if (!hexColor) return '#000000';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const addToCart = (product: Product) => {
  emit('add-to-cart', product);
};
</script>

<style scoped>
.product-card {
  will-change: transform;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  backface-visibility: hidden;
  transform: translateZ(0);
  height: 380px; /* Enforce exact height */
}

.product-card:hover {
  transform: translateY(-4px);
}

.tag-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5rem; /* Ensures consistent height for description */
  max-height: 2.5rem; /* Caps height to prevent expansion */
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 