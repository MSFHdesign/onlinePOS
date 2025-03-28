<template>
  <div class="overflow-x-auto">
    <table class="product-table w-full border-collapse min-w-[750px]">
      <thead>
        <tr>
          <th class="w-12"></th>
          <th class="w-20">ID</th>
          <th class="w-1/5">Navn</th>
          <th class="w-2/5 hidden md:table-cell">Beskrivelse</th>
          <th class="w-20">Pris</th>
          <th class="w-20 hidden sm:table-cell">Moms</th>
          <th class="w-28 hidden sm:table-cell">Tag</th>
          <th class="w-12"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 5" :key="i" class="animate-pulse">
          <td>
            <div class="flex items-center justify-center">
              <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </td>
          <td>
            <div class="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td>
            <div class="h-4 w-full max-w-[120px] bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td class="hidden md:table-cell">
            <div class="h-4 w-full max-w-[200px] bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td>
            <div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td class="hidden sm:table-cell">
            <div class="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
          <td class="hidden sm:table-cell">
            <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </td>
          <td>
            <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for the skeleton
</script>

<style scoped>
.product-table th {
  @apply font-medium text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 px-4 py-2.5 border-b-2 border-gray-200;
}

.product-table td {
  @apply px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700;
}

.product-table tr:last-child td {
  @apply border-b-0;
}
</style> 