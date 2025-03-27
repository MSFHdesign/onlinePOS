<template>
  <div class="hidden md:block flex-1 max-w-md mx-auto">
    <div class="relative">
      <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
        <i class="pi pi-search"></i>
      </span>
      <input
        type="text"
        placeholder="Søg efter produkter..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
               bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100
               focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // You can implement search functionality here
    // For example, navigate to a search results page:
    // router.push({ name: 'SearchResults', query: { q: searchQuery.value } });
    console.log('Searching for:', searchQuery.value);
  }
};
</script> 