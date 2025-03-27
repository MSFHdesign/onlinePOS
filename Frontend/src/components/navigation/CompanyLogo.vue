<template>
  <div class="flex items-center">
    <RouterLink to="/" class="flex items-center gap-2">
      <i class="pi pi-shopping-cart text-xl text-primary-light dark:text-primary-dark"></i>
      <h1 class="text-xl font-bold text-gray-800 dark:text-white">
        {{ restaurantName || 'OnlinePos' }}
      </h1>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useRestaurant } from '@/composables/useRestaurant';
import { computed } from 'vue';

const { getRestaurantName } = useRestaurant();
const restaurantName = computed(() => getRestaurantName());
</script> 