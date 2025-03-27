<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
    <h2 class="text-lg font-bold text-gray-700 dark:text-white mb-4">Indstillinger</h2>

    <form @submit.prevent="save">
      <!-- Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Venue Navn</label>
          <input v-model="restaurant.name" class="input" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Adresse</label>
          <input v-model="restaurant.address" class="input" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Telefon</label>
          <input v-model="restaurant.phone" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="restaurant.email" class="input" type="email" />
        </div>
      </div>

      <!-- Åbningstider -->
      <div class="mt-6">
        <h3 class="text-md font-bold mb-2">Åbningstider</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div v-for="(value, day) in restaurant.opening_hours" :key="day">
            <label class="block text-sm capitalize mb-1">{{ day }}</label>
            <input v-model="restaurant.opening_hours[day]" class="input" placeholder="10:00 - 22:00" />
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="mt-6 flex justify-end">
        <Button :disabled="loading" label="Gem ændringer" icon="pi pi-save" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Button from 'primevue/button'
import { useRestaurant } from '@/composables/useRestaurant'

const {
  restaurant,
  loading,
  error,
  fetchRestaurant,
  updateRestaurant,
  createRestaurant
} = useRestaurant()

const save = async () => {
  try {
    if (restaurant.value?.id) {
      await updateRestaurant(restaurant.value.id, restaurant.value)
      console.log("restaurant been updated: "+restaurant.value)
    } else {
      await createRestaurant(restaurant.value)
      console.log("restaurant been created: "+restaurant.value)
    }

    alert('Restaurantdata gemt!')
  } catch (err) {
    console.error('Fejl ved gemning:', err)
    alert('Der skete en fejl ved opdatering.')
  }
}

// Hent første restaurant ved mount
onMounted(async () => {
  await fetchRestaurant()
  console.log("Restaurant been fetched:")
  console.log(restaurant.value)
})
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-800 dark:text-white;
}
</style>
