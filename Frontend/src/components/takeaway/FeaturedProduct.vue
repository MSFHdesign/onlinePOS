<template>
  <div class="relative">
    <div class="absolute -top-16 -right-16 w-64 h-64 bg-indigo-400 bg-opacity-20 rounded-full filter blur-xl"></div>
    <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-400 bg-opacity-20 rounded-full filter blur-lg"></div>
    <div class="relative bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 rounded-xl p-6 w-64">
      <div class="absolute -top-3 -right-3 bg-yellow-400 rounded-md px-2 py-1 text-xs font-bold text-yellow-900 flex items-center">
        <i class="pi pi-star-fill mr-1"></i>
        FEATURED
      </div>
      <div class="w-full h-32 bg-indigo-200 bg-opacity-30 rounded-lg mb-4 flex items-center justify-center">
        <img 
          v-if="product && product.image_url" 
          :src="product.image_url" 
          :alt="product?.name" 
          class="w-full h-full object-cover rounded-lg"
        />
        <i v-else class="pi pi-shopping-bag text-4xl text-white"></i>
      </div>
      <h4 class="font-semibold mb-1">{{ product?.name || 'Featured Product' }}</h4>
      <p class="text-xs text-indigo-100 mb-3">{{ product?.description || 'Try our most popular product!' }}</p>
      <div class="flex justify-between items-center">
        <span class="font-bold">{{ formatPrice(product?.price) }}</span>
        <button 
          class="bg-white text-indigo-700 rounded-full p-1.5 hover:bg-indigo-50 transition-colors transform hover:scale-110 duration-300"
          @click="addToCart"
          :title="product ? `Add ${product.name} to cart` : 'Add to cart'"
        >
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/types/Product';
import { useToast } from 'primevue/usetoast';

const props = defineProps<{
  product?: Product | null;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>();

const toast = useToast();

const formatPrice = (price?: number | string): string => {
  if (!price) return '0,00 kr';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numPrice.toFixed(2).replace('.', ',')} kr`;
};

const addToCart = () => {
  if (props.product) {
    // Emit event to add product to cart
    emit('add-to-cart', props.product);
    
    // Show toast notification
    toast.add({ 
      severity: 'success', 
      summary: 'Tilføjet til kurv', 
      detail: `${props.product.name} er tilføjet til din kurv`, 
      life: 2000 
    });
  }
};
</script>

<style scoped>
/* Component-specific styling */
button {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style> 