import { ref, provide, inject } from 'vue'
import type { InjectionKey } from 'vue'
import { useApi } from './useApi'
import { DAY_KEYS } from '@/constants/days'

// Create a symbol as injection key
export const RestaurantKey = Symbol() as InjectionKey<ReturnType<typeof createRestaurantStore>>

// Create a singleton instance
let restaurantStore: ReturnType<typeof createRestaurantStore> | null = null

// Create the actual store implementation
function createRestaurantStore() {
  const { get, put, post, del } = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const defaultRestaurant = () => ({
    id: null,
    name: '',
    address: '',
    phone: '',
    email: '',
    opening_hours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    }
  })

  const restaurant = ref<any>(defaultRestaurant())
  const restaurants = ref<any[]>([])

  const fetchAllRestaurants = async () => {
    loading.value = true
    try {
      restaurants.value = await get('/restaurants')
    } catch (err) {
      error.value = 'Kunne ikke hente restauranter'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchRestaurant = async (id?: number | string) => {
    loading.value = true
    try {
      const list = id ? [await get(`/restaurants/${id}`)] : await get('/restaurants')
      if (list.length > 0) {
        restaurant.value = list[0]
        // fallback hvis opening_hours mangler
        if (!restaurant.value.opening_hours) {
          restaurant.value.opening_hours = defaultRestaurant().opening_hours
        }
      } else {
        restaurant.value = defaultRestaurant()
      }
    } catch (err) {
      error.value = 'Kunne ikke hente restaurant'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createRestaurant = async (payload: any) => {
    try {
      const created = await post('/restaurants', payload)
      restaurant.value = created
      return created
    } catch (err) {
      error.value = 'Kunne ikke oprette restaurant'
      console.error(err)
      throw err
    }
  }

  const updateRestaurant = async (id: number | string, payload: any) => {
    try {
      // Strip any unnecessary properties that might cause issues
      const cleanPayload = {
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        opening_hours: payload.opening_hours
      }
      
      const updated = await put(`/restaurants/${id}`, cleanPayload)
      restaurant.value = updated
      return updated
    } catch (err) {
      error.value = 'Kunne ikke opdatere restaurant'
      console.error(err)
      throw err
    }
  }

  const deleteRestaurant = async (id: number | string) => {
    try {
      await del(`/restaurants/${id}`)
      if (restaurant.value?.id === id) {
        restaurant.value = defaultRestaurant()
      }
    } catch (err) {
      error.value = 'Kunne ikke slette restaurant'
      console.error(err)
      throw err
    }
  }

  // Helper methods for restaurant info
  const getRestaurantName = () => restaurant.value?.name || ''
  const getRestaurantAddress = () => restaurant.value?.address || ''
  const getRestaurantPhone = () => restaurant.value?.phone || ''
  const getRestaurantEmail = () => restaurant.value?.email || ''
  const getOpeningHours = (day?: string) => {
    if (!restaurant.value?.opening_hours) return day ? '' : {}
    return day ? (restaurant.value.opening_hours[day] || '') : restaurant.value.opening_hours
  }
  const isOpen = () => {
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const days = DAY_KEYS.slice() // Create a copy to allow reordering
    // Adjust array to have Sunday as index 0 to match JavaScript's Date.getDay()
    const sunday = days.pop() // Remove Sunday from the end
    if (sunday) days.unshift(sunday) // Add it to the beginning
    
    const today = days[new Date().getDay()]
    
    // Get today's opening hours
    const hoursString = getOpeningHours(today)
    
    // Handle "Lukket" (closed) or empty string case
    if (!hoursString || hoursString.toLowerCase() === 'lukket') return false
    
    // Parse opening hours (format: "08:00 - 22:00")
    const timeParts = hoursString.split('-').map((t: string) => t.trim())
    if (timeParts.length !== 2) return false
    
    const [openTime, closeTime] = timeParts
    
    // Get current time
    const now = new Date()
    const currentHours = now.getHours().toString().padStart(2, '0')
    const currentMinutes = now.getMinutes().toString().padStart(2, '0')
    const currentTimeString = `${currentHours}:${currentMinutes}`
    
    // Parse opening and closing hours to handle potential variations in format
    const parseTimeString = (timeStr: string) => {
      // Handle empty or invalid formats
      if (!timeStr) return null
      
      // Try to extract hours and minutes from string like "08:00" or "8:00"
      const match = timeStr.match(/(\d{1,2}):(\d{2})/)
      if (!match) return null
      
      const hours = parseInt(match[1], 10)
      const minutes = parseInt(match[2], 10)
      
      // Return numeric value for comparison (e.g., 8:30 becomes 8.5)
      return hours + (minutes / 60)
    }
    
    const openTimeValue = parseTimeString(openTime)
    const closeTimeValue = parseTimeString(closeTime)
    const currentTimeValue = parseTimeString(currentTimeString)
    
    if (openTimeValue === null || closeTimeValue === null || currentTimeValue === null) {
      return false // Invalid time format
    }
    
    // Check if current time is between opening and closing time
    return currentTimeValue >= openTimeValue && currentTimeValue <= closeTimeValue
  }

  return {
    // State
    restaurant,
    restaurants,
    loading,
    error,
    
    // CRUD operations
    fetchAllRestaurants,
    fetchRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    
    // Helper methods
    getRestaurantName,
    getRestaurantAddress,
    getRestaurantPhone,
    getRestaurantEmail,
    getOpeningHours,
    isOpen
  }
}

// Main composable that provides access to the restaurant store
export function useRestaurant() {
  // If there's already an injected instance, use it
  const injectedStore = inject(RestaurantKey)
  if (injectedStore) return injectedStore
  
  // Create a singleton if it doesn't exist
  if (!restaurantStore) {
    restaurantStore = createRestaurantStore()
  }
  
  return restaurantStore
}

// Use this in your main.ts or App.vue to provide the store globally
export function provideRestaurantStore() {
  const store = useRestaurant()
  provide(RestaurantKey, store)
  return store
}
