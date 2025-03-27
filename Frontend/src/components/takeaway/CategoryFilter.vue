<template>
  <div class="mb-6 category-filter-container">
    <h3 class="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-3">Kategorier</h3>
    
    <div class="flex flex-wrap gap-2 min-h-[40px]">
      <button 
        @click="selectCategory('all')"
        class="category-chip"
        :class="{ 'active': selectedCategory === 'all' }"
      >
        Alle
      </button>
      
      <button 
        v-for="category in categories" 
        :key="category.name"
        @click="selectCategory(category.name)"
        class="category-chip"
        :class="{ 'active': selectedCategory === category.name }"
        :style="getChipStyle(category)"
      >
        <span class="inline-flex items-center">
          {{ category.name }}
          <span class="ml-1 text-xs opacity-70">{{ getCategoryCount(category.name) }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
import type { Product } from '@/types/Product';

interface Category {
  name: string;
  color: string;
}

const props = defineProps<{
  products: Product[];
}>();

const emit = defineEmits<{
  (e: 'filter', category: string): void;
}>();

const selectedCategory = ref('all');

const categories = computed(() => {
  const uniqueCategories = new Map<string, Category>();
  
  props.products.forEach(product => {
    if (product.tag_name && product.tag_color) {
      if (!uniqueCategories.has(product.tag_name)) {
        uniqueCategories.set(product.tag_name, {
          name: product.tag_name,
          color: product.tag_color
        });
      }
    }
  });
  
  return Array.from(uniqueCategories.values());
});

const getCategoryCount = (categoryName: string) => {
  if (categoryName === 'all') return `(${props.products.length})`;
  return `(${props.products.filter(p => p.tag_name === categoryName).length})`;
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

const getChipStyle = (category: Category) => {
  if (selectedCategory.value === category.name) {
    return {
      backgroundColor: category.color,
      color: getContrastColor(category.color),
      borderColor: category.color
    };
  }
  
  return {
    borderColor: category.color,
    color: category.color
  };
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  emit('filter', category);
};

// Initialize with all products
selectCategory('all');
</script>

<style scoped>
.category-filter-container {
  transition: all 0.3s ease;
}

.category-chip {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1.5px solid;
  background-color: transparent;
  transition: all 0.2s ease;
  transform-origin: center;
}

.category-chip:not(.active) {
  background-color: transparent;
  border-color: #e2e8f0;
  color: #64748b;
}

.category-chip:hover:not(.active) {
  background-color: rgba(100, 116, 139, 0.1);
  transform: translateY(-1px);
}

.category-chip.active {
  font-weight: 600;
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dark .category-chip:not(.active) {
  border-color: #334155;
  color: #94a3b8;
}

.dark .category-chip:hover:not(.active) {
  background-color: rgba(148, 163, 184, 0.1);
}

.dark .category-chip.active {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
}
</style> 