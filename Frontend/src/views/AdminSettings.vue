<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
    <h2 class="text-lg font-bold text-gray-700 dark:text-white mb-4">Indstillinger</h2>

    <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
      {{ successMessage }}
    </div>

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
          <div v-for="day in orderedDays" :key="day.key">
            <label class="block text-sm font-medium mb-1">{{ day.label }}</label>
            <input v-model="restaurant.opening_hours[day.key]" class="input" placeholder="08:00 - 22:00" />
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="mt-6 flex justify-end">
        <Button :loading="loading" type="submit" label="Gem ændringer" icon="pi pi-save" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { useRestaurant } from '@/composables/useRestaurant'
import { ORDERED_DAYS } from '@/constants/days'

const successMessage = ref('')

const {
  restaurant,
  loading,
  error,
  fetchRestaurant,
  updateRestaurant,
  createRestaurant
} = useRestaurant()

// Use the imported ORDERED_DAYS constant
const orderedDays = ORDERED_DAYS;

const save = async () => {
  successMessage.value = ''
  
  try {
    // Create a clean copy of the data to avoid reactivity issues
    const restaurantData = JSON.parse(JSON.stringify(restaurant.value))
    
    if (restaurantData.id) {
      const result = await updateRestaurant(restaurantData.id, restaurantData)
      successMessage.value = 'Restaurant opdateret!'
    } else {
      const result = await createRestaurant(restaurantData)
      successMessage.value = 'Restaurant oprettet!'
    }
  } catch (err) {
    console.error('Fejl ved gemning:', err)
    if (err instanceof Error) {
      error.value = `Der skete en fejl ved opdatering: ${err.message}`
    } else {
      error.value = 'Der skete en ukendt fejl ved opdatering.'
    }
  }
}

// Hent første restaurant ved mount
onMounted(async () => {
  try {
    await fetchRestaurant()

    if (!restaurant.value.opening_hours) {
      restaurant.value.opening_hours = {
        monday: '', tuesday: '', wednesday: '', thursday: '',
        friday: '', saturday: '', sunday: ''
      }
    }
  } catch (err) {
    console.error('Fejl ved indlæsning af restaurant:', err)
    error.value = 'Kunne ikke indlæse restaurant data.'
  }
})
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-700 text-gray-800 dark:text-white;
}
</style>
