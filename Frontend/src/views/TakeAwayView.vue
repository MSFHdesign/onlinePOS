<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <HeroSection />
    
    <div class="container mx-auto px-4 pb-16 flex-grow">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main Content Area - Fixed minimum heights to prevent layout shifts -->
        <div class="flex-1 min-w-0 flex flex-col">
          <!-- Category Filters -->
          <CategoryFilter 
            :products="products" 
            @filter="handleCategoryFilter" 
          />
          
          <!-- Product Grid - Strict fixed height to prevent any layout shift when filtering/searching -->
          <div id="menu" class="flex-grow flex flex-col" style="min-height: 500px;">
            <ProductGrid 
              :products="products" 
              :selected-category="selectedCategory"
              @add-to-cart="addToCart" 
            />
          </div>
        </div>
        
        <!-- Shopping Cart Column - Fixed width at large screens -->
        <div class="lg:w-96 lg:flex-shrink-0">
          <div class="lg:sticky lg:top-6 h-full">
            <ShoppingCart 
              v-model:items="cartItems"
              @checkout="openCheckoutModal"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Order Success Notification -->
    <div v-if="showOrderSuccess" class="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg z-30 flex items-center animate-slide-in-right">
      <i class="pi pi-check-circle text-xl mr-3"></i>
      <div>
        <h4 class="font-semibold mb-1">Bestilling modtaget!</h4>
        <p class="text-sm">Tak for din bestilling. Du modtager en bekræftelse på email.</p>
      </div>
      <button @click="showOrderSuccess = false" class="ml-4 text-white/80 hover:text-white">
        <i class="pi pi-times"></i>
      </button>
    </div>
    
    <!-- Checkout Modal -->
    <CheckoutModal 
      :items="cartItems"
      :visible="isCheckoutOpen"
      @close="isCheckoutOpen = false"
      @order-completed="handleOrderCompleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useApi } from '@/composables/useApi';
import { useToast } from 'primevue/usetoast';
import HeroSection from '@/components/takeaway/HeroSection.vue';
import CategoryFilter from '@/components/takeaway/CategoryFilter.vue';
import ProductGrid from '@/components/takeaway/ProductGrid.vue';
import ShoppingCart from '@/components/takeaway/ShoppingCart.vue';
import CheckoutModal from '@/components/takeaway/CheckoutModal.vue';
import type { Product } from '@/types/Product';

// Define CartItem type locally if not available in types
interface CartItem {
  product: Product;
  quantity: number;
}

const toast = useToast();
const { get } = useApi();

const products = ref<Product[]>([]);
const cartItems = ref<CartItem[]>([]);
const selectedCategory = ref('all');
const isCheckoutOpen = ref(false);
const showOrderSuccess = ref(false);

const fetchProducts = async () => {
  try {
    const res = await get('/products');
    products.value = res;
    
    // Add event listener for category reset
    document.addEventListener('reset-category', handleCategoryReset);
  } catch (err) {
    console.error('Fejl ved hentning:', err);
    toast.add({ 
      severity: 'error', 
      summary: 'Fejl', 
      detail: 'Der opstod en fejl under indlæsning af produkter', 
      life: 3000 
    });
  }
};

const handleCategoryFilter = (category: string) => {
  selectedCategory.value = category;
  
  // Scroll to product section
  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
};

const handleCategoryReset = () => {
  selectedCategory.value = 'all';
};

const addToCart = (product: Product) => {
  const existingItemIndex = cartItems.value.findIndex(item => item.product.id === product.id);
  
  if (existingItemIndex >= 0) {
    // Increment quantity if product already in cart
    cartItems.value[existingItemIndex].quantity += 1;
  } else {
    // Add new item to cart
    cartItems.value.push({
      product,
      quantity: 1
    });
  }
  
  // Show toast notification
  toast.add({ 
    severity: 'success', 
    summary: 'Tilføjet til kurv', 
    detail: `${product.name} er tilføjet til din kurv`, 
    life: 2000 
  });
};

const openCheckoutModal = () => {
  isCheckoutOpen.value = true;
};

const handleOrderCompleted = () => {
  // Clear cart
  cartItems.value = [];
  
  // Close checkout modal
  isCheckoutOpen.value = false;
  
  // Show success message
  showOrderSuccess.value = true;
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    showOrderSuccess.value = false;
  }, 5000);
};

onMounted(fetchProducts);

// Remove event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('reset-category', handleCategoryReset);
});
</script>

<style scoped>
/* Smooth transitions for height changes */
#menu {
  transition: min-height 0.3s ease;
  will-change: min-height;
  display: flex;
  flex-direction: column;
  contain: layout style paint; /* CSS containment for better performance */
  height: 500px; /* Strict fixed height */
}

/* Fix the overall layout */
.container {
  contain: layout;
  will-change: contents;
}

/* Fix column layout */
.flex-1 {
  contain: layout style;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
  will-change: transform, opacity;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out forwards;
  will-change: opacity;
}

.animate-slide-in-right {
  animation: slideInRight 0.4s ease-out forwards;
  will-change: transform, opacity;
}
</style> 