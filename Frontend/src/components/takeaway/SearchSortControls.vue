<template>
  <div>
    <!-- Search & Sort Controls -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          @input="emitSearchFilter"
        />
      </div>
      
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600 dark:text-gray-300">Sortér efter:</label>
        <select 
          v-model="sortBy"
          @change="emitSortChange"
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
    <div v-if="searchQuery.trim() || selectedCategory !== 'all'" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      <span v-if="filteredCount > 0" class="animate-fade-in">
        Viser {{ filteredCount }} {{ filteredCount === 1 ? 'produkt' : 'produkter' }}
        {{ selectedCategory !== 'all' ? `i kategorien "${selectedCategory}"` : '' }}
        {{ searchQuery.trim() ? `med søgeordet "${searchQuery}"` : '' }}
      </span>
      <button 
        @click="clearFilters" 
        class="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <i class="pi pi-times-circle mr-1"></i>Ryd filter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';

const props = defineProps<{
  selectedCategory: string;
  filteredCount: number;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'sort', sortBy: string): void;
  (e: 'clear-filters'): void;
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
  }, 500);
});

const emitSearchFilter = () => {
  emit('search', searchQuery.value);
};

const emitSortChange = () => {
  emit('sort', sortBy.value);
};

// Clear all filters and search
const clearFilters = () => {
  searchQuery.value = '';
  emit('search', '');
  emit('clear-filters');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(5px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}
</style> 