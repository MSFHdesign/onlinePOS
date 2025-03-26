<script setup lang="ts">
import { RouterView } from 'vue-router';
defineProps();
console.log('App loaded');
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="text-2xl font-bold mb-4">OnlinePos</div>
    <RouterView />
  </div>
</template>
