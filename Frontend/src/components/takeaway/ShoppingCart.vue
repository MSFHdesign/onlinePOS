<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
    <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 border-b border-indigo-100 dark:border-indigo-800/30">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <i class="pi pi-shopping-cart mr-2"></i>
        Din kurv
        <span v-if="totalItems > 0" class="ml-2 bg-primary-light dark:bg-primary-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {{ totalItems }}
        </span>
      </h3>
    </div>
    
    <div class="p-4 flex-grow flex flex-col">
      <!-- Empty Cart State -->
      <div v-if="items.length === 0" class="py-8 text-center flex-grow flex flex-col justify-center">
        <i class="pi pi-shopping-cart text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
        <p class="text-gray-500 dark:text-gray-400">Din kurv er tom</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Tilføj produkter fra menuen</p>
      </div>
      
      <!-- Cart Items -->
      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700 flex-grow overflow-y-auto max-h-[50vh] lg:max-h-[60vh]">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="py-3 first:pt-0 last:pb-0 flex justify-between"
        >
          <div class="flex-1 pr-4">
            <div class="flex justify-between">
              <div class="max-w-[60%]">
                <h4 class="font-medium text-gray-800 dark:text-white truncate" :title="item.product.name">{{ item.product.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate" :title="item.product.description">
                  {{ item.product.description }}
                </p>
              </div>
              <div class="text-right">
                <span class="font-medium text-gray-800 dark:text-white">{{ formatPrice(item.product.price * item.quantity) }}</span>
              </div>
            </div>
            
            <div class="mt-2 flex items-center justify-between">
              <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
                <button 
                  @click="decreaseQuantity(index)"
                  class="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md"
                  :disabled="item.quantity <= 1"
                >
                  <i class="pi pi-minus text-xs"></i>
                </button>
                <span class="px-2 py-1 text-sm text-gray-800 dark:text-white">{{ item.quantity }}</span>
                <button 
                  @click="increaseQuantity(index)"
                  class="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md"
                >
                  <i class="pi pi-plus text-xs"></i>
                </button>
              </div>
              
              <button 
                @click="removeItem(index)" 
                class="text-red-500 hover:text-red-700 transition-colors"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cart Summary & Checkout -->
      <div v-if="items.length > 0" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">Subtotal:</span>
          <span class="font-medium text-gray-800 dark:text-white">{{ formatPrice(subtotal) }}</span>
        </div>
        
        <div class="flex justify-between mb-4">
          <span class="text-gray-600 dark:text-gray-300">Moms (25%):</span>
          <span class="text-gray-800 dark:text-white">{{ formatPrice(tax) }}</span>
        </div>
        
        <div class="flex justify-between text-lg font-bold mb-4">
          <span class="text-gray-800 dark:text-white">Total:</span>
          <span class="text-gray-900 dark:text-white">{{ formatPrice(total) }}</span>
        </div>
        
        <button 
          @click="checkout"
          class="w-full bg-primary-light dark:bg-primary-dark hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
        >
          <i class="pi pi-credit-card mr-2"></i>
          Gå til betaling
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { Product } from '@/types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

const props = defineProps<{
  items: CartItem[];
}>();

const emit = defineEmits<{
  (e: 'update:items', items: CartItem[]): void;
  (e: 'checkout'): void;
}>();

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toFixed(2).replace('.', ',') + ' kr';
};

const totalItems = computed(() => {
  return props.items.reduce((sum, item) => sum + item.quantity, 0);
});

const subtotal = computed(() => {
  return props.items.reduce((total, item) => {
    return total + (Number(item.product.price) * item.quantity);
  }, 0);
});

const tax = computed(() => {
  return subtotal.value * 0.25;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const increaseQuantity = (index: number) => {
  const updatedItems = [...props.items];
  updatedItems[index].quantity += 1;
  emit('update:items', updatedItems);
};

const decreaseQuantity = (index: number) => {
  const updatedItems = [...props.items];
  if (updatedItems[index].quantity > 1) {
    updatedItems[index].quantity -= 1;
    emit('update:items', updatedItems);
  }
};

const removeItem = (index: number) => {
  const updatedItems = [...props.items];
  updatedItems.splice(index, 1);
  emit('update:items', updatedItems);
};

const checkout = () => {
  emit('checkout');
};
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 