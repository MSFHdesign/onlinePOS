<template>
  <div v-if="visible" 
       class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 checkout-modal-container"
       @click="handleBackdropClick">
    <div class="modal-content bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-modal-in"
         @click.stop> <!-- Stop propagation to prevent closing when clicking inside the modal -->
      <!-- Fixed header -->
      <div class="modal-header bg-indigo-50 dark:bg-indigo-900/20 p-4 border-b border-indigo-100 dark:border-indigo-800/30 flex justify-between items-center sticky top-0 z-10">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <i class="pi pi-credit-card mr-2"></i>
          Afslut din ordre
        </h3>
        <button 
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <!-- Scrollable content area -->
      <div ref="modalBodyRef" class="modal-body p-6 overflow-y-auto">
        <!-- Order Summary -->
        <div class="mb-6">
          <h4 class="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-3">Din bestilling</h4>
          <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded-md">
            <div v-for="(item, index) in items" :key="index" class="flex justify-between pb-2 mb-2 border-b border-gray-200 dark:border-gray-600 last:border-0 last:mb-0 last:pb-0">
              <div class="flex-1">
                <span class="font-medium text-gray-800 dark:text-white">{{ item.product.name }}</span>
                <span class="text-gray-500 dark:text-gray-400 ml-2">x{{ item.quantity }}</span>
              </div>
              <span class="text-gray-800 dark:text-white font-medium">{{ formatPrice(item.product.price * item.quantity) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Payment Form -->
        <form @submit.prevent="processPayment">
          <!-- Customer Info -->
          <div class="mb-6">
            <h4 class="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-3">Dine oplysninger</h4>
            
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fornavn</label>
                  <input 
                    type="text" 
                    v-model="firstName"
                    class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                           bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                    @focus="handleInputFocus"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Efternavn</label>
                  <input 
                    type="text" 
                    v-model="lastName"
                    class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                           bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    required
                    @focus="handleInputFocus"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  v-model="email"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                         bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  required
                  @focus="handleInputFocus"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefonnummer</label>
                <input 
                  type="tel" 
                  v-model="phone"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                         bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  required
                  @focus="handleInputFocus"
                />
              </div>
            </div>
          </div>
          
          <!-- Order Notes -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bemærkninger til bestilling</label>
            <textarea 
              v-model="notes"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                     bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              rows="3"
              @focus="handleInputFocus"
            ></textarea>
          </div>
          
          <!-- Payment Method -->
          <div class="mb-6">
            <h4 class="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-3">Betalingsmetode</h4>
            <div class="space-y-2">
              <label class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input type="radio" name="payment" value="card" v-model="paymentMethod" class="mr-2" />
                <i class="pi pi-credit-card mr-2 text-gray-600 dark:text-gray-400"></i>
                <span class="text-gray-800 dark:text-white">Kreditkort</span>
              </label>
              <label class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input type="radio" name="payment" value="mobilepay" v-model="paymentMethod" class="mr-2" />
                <i class="pi pi-mobile mr-2 text-gray-600 dark:text-gray-400"></i>
                <span class="text-gray-800 dark:text-white">MobilePay</span>
              </label>
              <label class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input type="radio" name="payment" value="cash" v-model="paymentMethod" class="mr-2" />
                <i class="pi pi-wallet mr-2 text-gray-600 dark:text-gray-400"></i>
                <span class="text-gray-800 dark:text-white">Kontant ved afhentning</span>
              </label>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Fixed footer with total and submit button -->
      <div class="modal-footer p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between text-lg font-bold mb-4">
          <span class="text-gray-800 dark:text-white">Total:</span>
          <span class="text-gray-900 dark:text-white">{{ formatPrice(total) }}</span>
        </div>
        
        <button 
          type="button" 
          @click="processPayment"
          class="w-full bg-primary-light dark:bg-primary-dark hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
          :disabled="isSubmitting"
        >
          <i v-if="isSubmitting" class="pi pi-spin pi-spinner mr-2"></i>
          <i v-else class="pi pi-check-circle mr-2"></i>
          {{ isSubmitting ? 'Behandler...' : 'Gennemfør bestilling' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted } from 'vue';
import type { Product } from '@/types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

const props = defineProps<{
  items: CartItem[];
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'order-completed'): void;
}>();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const notes = ref('');
const paymentMethod = ref('card');
const isSubmitting = ref(false);
const modalBodyRef = ref<HTMLElement | null>(null);

// Handle closing the modal
const closeModal = () => {
  emit('close');
};

// Close modal when clicking on backdrop
const handleBackdropClick = (event: MouseEvent) => {
  // Only close if clicking the backdrop itself
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

// Handle input focus for mobile keyboard
const handleInputFocus = (event: FocusEvent) => {
  // On mobile, scroll the input into view with additional offset
  if (window.innerWidth < 640) {
    const input = event.target as HTMLElement;
    setTimeout(() => {
      // Use scrollIntoView with an offset
      const modalBody = modalBodyRef.value;
      if (modalBody && input) {
        const inputPosition = input.getBoundingClientRect().top;
        const modalPosition = modalBody.getBoundingClientRect().top;
        const scrollOffset = inputPosition - modalPosition - 100; // 100px offset above input
        
        if (scrollOffset > 0) {
          modalBody.scrollTop += scrollOffset;
        }
      }
    }, 300); // Delay to account for keyboard opening
  }
};

// Handle viewport adjustments for mobile devices
const adjustForKeyboard = () => {
  // Resize modal body when keyboard appears
  if (window.innerWidth < 640) {
    handleResize();
  }
};

// Lifecycle hooks for event listeners
onMounted(() => {
  window.addEventListener('resize', handleResize);
  document.addEventListener('focus', adjustForKeyboard, true);
  // Initial sizing
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('focus', adjustForKeyboard, true);
});

// Resize handler to adjust modal height based on screen size
const handleResize = () => {
  if (props.visible) {
    const modalBody = document.querySelector('.modal-body') as HTMLElement;
    if (modalBody) {
      const viewportHeight = window.innerHeight;
      const isMobile = window.innerWidth < 640;
      
      // On mobile, account for keyboard by using a smaller percentage
      // On desktop, use 90% of viewport height minus fixed header/footer
      const headerFooterHeight = 160; // Approximate height of header + footer
      const maxHeight = isMobile 
        ? `${viewportHeight * 0.6}px` // 60% for mobile to account for keyboard
        : `${viewportHeight * 0.9 - headerFooterHeight}px`; // 90% for desktop
        
      // Set max height on the modal body
      modalBody.style.maxHeight = maxHeight;
    }
  }
};

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
});

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toFixed(2).replace('.', ',') + ' kr';
};

const processPayment = async () => {
  isSubmitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Success
    emit('order-completed');
    resetForm();
  } catch (error) {
    console.error('Payment failed:', error);
    // Handle error (would add error state in a real app)
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  phone.value = '';
  notes.value = '';
  paymentMethod.value = 'card';
};
</script>

<style scoped>
.checkout-modal-container {
  /* Prevent scrolling behind modal */
  overflow: hidden;
}

.modal-content {
  /* Set max-height for different screen sizes */
  max-height: 90vh; /* Maximum of 90% viewport height */
  display: flex;
  flex-direction: column;
  position: relative;
  /* Prevent modal from growing beyond content */
  height: auto;
  /* Add bounce effect when reaching limits */
  overflow-y: hidden;
}

.modal-body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  /* Light scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.5) rgba(15, 23, 42, 0.1);
}

/* Webkit scrollbar styling (Chrome, Safari, Edge) */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.05);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

.animate-modal-in {
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .modal-content {
    max-height: 100vh;
    height: 100%;
    border-radius: 0;
    width: 100%;
    margin: 0;
  }
  
  .checkout-modal-container {
    padding: 0;
  }
}
</style> 