<template>
  <div class="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
    <div class="flex items-center mb-4 space-x-2">
      <i class="pi pi-clock text-primary-light dark:text-primary-dark text-lg"></i>
      <h3 class="text-lg font-semibold">{{ restaurantName }}</h3>
      <span v-if="isOpenNow" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Åben nu</span>
      <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Lukket</span>
    </div>

    <!-- Contact Info -->
    <div class="mb-4">
      <div v-if="restaurantAddress" class="flex items-center text-sm mb-2">
        <i class="pi pi-map-marker mr-2 text-gray-600 dark:text-gray-400"></i>
        <span>{{ restaurantAddress }}</span>
      </div>
      <div v-if="restaurantPhone" class="flex items-center text-sm mb-2">
        <i class="pi pi-phone mr-2 text-gray-600 dark:text-gray-400"></i>
        <a :href="`tel:${restaurantPhone}`" class="hover:text-primary-light dark:hover:text-primary-dark">{{ restaurantPhone }}</a>
      </div>
      <div v-if="restaurantEmail" class="flex items-center text-sm">
        <i class="pi pi-envelope mr-2 text-gray-600 dark:text-gray-400"></i>
        <a :href="`mailto:${restaurantEmail}`" class="hover:text-primary-light dark:hover:text-primary-dark">{{ restaurantEmail }}</a>
      </div>
    </div>

    <!-- Opening Hours -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
      <h4 class="font-medium mb-2">Åbningstider</h4>
      <div v-for="day in orderedDays" :key="day.key" class="flex justify-between text-sm py-1">
        <span class="capitalize font-medium">{{ day.label }}</span>
        <span v-if="openingHours[day.key]">{{ openingHours[day.key] }}</span>
        <span v-else class="text-gray-500 dark:text-gray-400">Lukket</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRestaurant } from '@/composables/useRestaurant';
import { ORDERED_DAYS } from '@/constants/days';

const {
  getRestaurantName,
  getRestaurantAddress,
  getRestaurantPhone,
  getRestaurantEmail,
  getOpeningHours,
  isOpen
} = useRestaurant();

const restaurantName = computed(() => getRestaurantName());
const restaurantAddress = computed(() => getRestaurantAddress());
const restaurantPhone = computed(() => getRestaurantPhone());
const restaurantEmail = computed(() => getRestaurantEmail());
const openingHours = computed(() => getOpeningHours());
const isOpenNow = computed(() => isOpen());

// Use the imported ORDERED_DAYS constant
const orderedDays = ORDERED_DAYS;
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 