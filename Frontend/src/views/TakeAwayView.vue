<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <HeroSection @add-to-cart="addToCart" />
    
    <div class="container mx-auto px-4 pb-16 flex-grow overflow-hidden">
      <!-- Main Content Area -->
      <div class="flex flex-col lg:flex-row gap-8 h-full">
        <!-- Left Column - Main Content -->
        <div class="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
          
          <!-- Featured Product Section -->
          <div v-if="featuredProduct" class="mb-6">
            <FeaturedProduct 
              :product="featuredProduct" 
              @add-to-cart="addToCart"
            />
          </div>
          
          <!-- Sticky Header with Filters and Search -->
          <div class="sticky-header bg-slate-800 pb-4 pt-2 z-20">
            <!-- Category Filters -->
            <CategoryFilter 
              :products="products" 
              @filter="handleCategoryFilter" 
            />
            
            <!-- Search and Sort Controls -->
            <SearchSortControls
              :selected-category="selectedCategory"
              :filtered-count="filteredCount"
              @search="handleSearch"
              @sort="handleSort"
              @clear-filters="handleCategoryReset"
            />
          </div>
          
          <!-- Product Grid with explicit height and scroll -->
          <div id="menu" class="flex-grow overflow-y-auto scrollbar-container relative" @scroll="handleScroll">
            <!-- Depth fade effects -->
            <div class="fade-container pointer-events-none">
              <div v-show="showTopFade" class="scrollbar-fade-top absolute top-0 left-0 right-0 z-10" 
                   :style="`opacity: ${topFadeOpacity}; height: ${16 + (topFadeOpacity * 10)}px; transform: translateY(${-5 + (topFadeOpacity * 5)}px)`"></div>
              <div v-show="showBottomFade" class="scrollbar-fade-bottom absolute bottom-0 left-0 right-0 z-10" 
                   :style="`opacity: ${bottomFadeOpacity}; height: ${16 + (bottomFadeOpacity * 10)}px; transform: translateY(${5 - (bottomFadeOpacity * 5)}px)`"></div>
            </div>
            <ProductGrid 
              :products="products" 
              :selected-category="selectedCategory"
              :search-query="searchQuery"
              :sort-by="sortBy"
              @update:filtered-count="filteredCount = $event"
              @add-to-cart="addToCart" 
            />
          </div>
        </div>
        
        <!-- Shopping Cart Column -->
        <div class="lg:w-96 lg:flex-shrink-0">
          <div class="lg:sticky lg:top-6">
            <ShoppingCart 
              v-model:items="cartItems"
              @checkout="openCheckoutModal"
            />
            
            <!-- Restaurant Info Component -->
            <div class="mt-4">
              <RestaurantInfo />
            </div>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useApi } from '@/composables/useApi';
import { useToast } from 'primevue/usetoast';
import HeroSection from '@/components/takeaway/HeroSection.vue';
import CategoryFilter from '@/components/takeaway/CategoryFilter.vue';
import ProductGrid from '@/components/takeaway/ProductGrid.vue';
import ShoppingCart from '@/components/takeaway/ShoppingCart.vue';
import CheckoutModal from '@/components/takeaway/CheckoutModal.vue';
import SearchSortControls from '@/components/takeaway/SearchSortControls.vue';
import RestaurantInfo from '@/components/takeaway/RestaurantInfo.vue';
import FeaturedProduct from '@/components/takeaway/FeaturedProduct.vue';
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
const searchQuery = ref('');
const sortBy = ref('name');
const filteredCount = ref(0);
const isCheckoutOpen = ref(false);
const showOrderSuccess = ref(false);
const showTopFade = ref(false);
const showBottomFade = ref(false);
const topFadeOpacity = ref(0);
const bottomFadeOpacity = ref(0);
const scrolled = ref(false);
const orderComplete = ref(false);
const loading = ref(true);
const featuredProduct = ref<Product | null>(null);

// Handle search input from the search controls
const handleSearch = (query: string) => {
  searchQuery.value = query;
  resetScrollPosition();
};

// Handle sort changes from the sort controls
const handleSort = (sort: string) => {
  sortBy.value = sort;
};

// Enhanced scroll effects with parallax-like depth
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const height = target.clientHeight;
  
  // Calculate dynamic opacities based on scroll position
  // Top fade gets stronger as you scroll down
  if (scrollTop > 0) {
    showTopFade.value = true;
    // Calculate opacity based on scroll position (max 0.95)
    topFadeOpacity.value = Math.min(0.95, scrollTop / 100); 
  } else {
    showTopFade.value = false;
  }
  
  // Bottom fade gets stronger as you approach the bottom
  const distanceFromBottom = scrollHeight - (scrollTop + height);
  if (distanceFromBottom > 0) {
    showBottomFade.value = true;
    // Calculate opacity based on remaining content (max 0.95)
    bottomFadeOpacity.value = Math.min(0.95, 1 - (distanceFromBottom / 100));
  } else {
    showBottomFade.value = false;
  }
};

// Reset scroll position after filter changes
const resetScrollPosition = () => {
  const menuElement = document.getElementById('menu');
  if (menuElement) {
    // Reset scroll position to top
    menuElement.scrollTop = 0;
    // Check fade states after scroll reset
    handleScroll({ target: menuElement } as unknown as Event);
  }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await get('/products');
    products.value = res;
    
    // Find a featured product (product with is_featured = true)
    featuredProduct.value = products.value.find(p => p.is_featured) || null;
    
    // Add event listener for category reset
    document.addEventListener('reset-category', handleCategoryReset);
    
    // Add scroll event listener after products load
    nextTick(() => {
      const menuElement = document.getElementById('menu');
      if (menuElement) {
        menuElement.addEventListener('scroll', handleScroll);
        // Initial check for fades
        handleScroll({ target: menuElement } as unknown as Event);
      }
    });
  } catch (err) {
    console.error('Fejl ved hentning:', err);
    toast.add({ 
      severity: 'error', 
      summary: 'Fejl', 
      detail: 'Der opstod en fejl under indlæsning af produkter', 
      life: 3000 
    });
  } finally {
    loading.value = false;
  }
};

const handleCategoryFilter = (category: string) => {
  selectedCategory.value = category;
  // Clear search when changing categories
  searchQuery.value = '';
  resetScrollPosition();
};

const handleCategoryReset = () => {
  selectedCategory.value = 'all';
  searchQuery.value = '';
  resetScrollPosition();
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

// Remove event listeners on component unmount
onUnmounted(() => {
  document.removeEventListener('reset-category', handleCategoryReset);
  const menuElement = document.getElementById('menu');
  if (menuElement) {
    menuElement.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
/* Sticky header for filters */
.sticky-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  background-color: rgba(30, 41, 59, 0.95); /* slate-800 with transparency */
  box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1); /* Subtle indigo border */
}

/* Scrollbar container with fade effects */
.scrollbar-container {
  position: relative;
}

/* Fade container for effects */
.fade-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  pointer-events: none;
}

/* Top shadow fade effect for scrolling content */
.scrollbar-fade-top {
  background: linear-gradient(to bottom, 
    rgba(30, 41, 59, 0.95) 0%, 
    rgba(30, 41, 59, 0.8) 25%,
    rgba(30, 41, 59, 0.4) 50%,
    rgba(30, 41, 59, 0) 100%);
  backdrop-filter: blur(8px);
  pointer-events: none;
  transition: opacity 0.3s ease, height 0.3s ease;
  border-bottom: 1px solid rgba(99, 102, 241, 0.05);
  box-shadow: 0 8px 16px -8px rgba(15, 23, 42, 0.1);
}

/* Bottom shadow fade effect for scrolling content */
.scrollbar-fade-bottom {
  background: linear-gradient(to top, 
    rgba(30, 41, 59, 0.95) 0%, 
    rgba(30, 41, 59, 0.8) 25%,
    rgba(30, 41, 59, 0.4) 50%,
    rgba(30, 41, 59, 0) 100%);
  backdrop-filter: blur(8px);
  pointer-events: none;
  transition: opacity 0.3s ease, height 0.3s ease;
  border-top: 1px solid rgba(99, 102, 241, 0.05);
  box-shadow: 0 -8px 16px -8px rgba(15, 23, 42, 0.1);
}

/* Glass-like stylish scrollbar for menu */
#menu {
  flex-grow: 1;
  min-height: 400px;
  max-height: calc(100vh - 240px); /* Account for header and other elements */
  overflow-y: auto !important;
  overflow-x: hidden;
  /* Scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.5) rgba(15, 23, 42, 0.1);
  /* Add smooth scroll behavior */
  scroll-behavior: smooth;
  transition: all 0.3s ease;
  /* Add some spacing from sticky header */
  padding-top: 0.5rem;
  /* Enhance scroll inertia for a smoother feel */
  -webkit-overflow-scrolling: touch;
  /* Create depth with slight shadow */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Webkit scrollbar styling (Chrome, Safari, newer Edge) */
#menu::-webkit-scrollbar {
  width: 8px;
  transition: width 0.3s ease;
}

#menu:hover::-webkit-scrollbar {
  width: 10px; /* Slightly wider on hover */
}

#menu::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.1); 
  border-radius: 10px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

#menu::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.5); 
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
  backdrop-filter: blur(8px);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

#menu::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.8);
  border: 1px solid transparent;
  background-clip: content-box;
  box-shadow: inset 0 0 8px rgba(79, 70, 229, 0.4);
}

/* Reset container styles */
.container {
  height: 100%;
  overflow: hidden;
}

/* Ensure parent containers don't restrict overflow */
.flex-1 {
  overflow: hidden;
}

/* Other animations */
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