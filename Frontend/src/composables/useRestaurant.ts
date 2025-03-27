import { ref } from 'vue'
import { useApi } from './useApi'

export function useRestaurant() {
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
        console.log(restaurants.value)
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
      if (id) {
        restaurant.value = await get(`/restaurants/${id}`)
      } else {
        const list = await get('/restaurants')
        if (list.length > 0) {
          restaurant.value = list[0]
        } else {
          restaurant.value = defaultRestaurant()
        }
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
      restaurant.value = created // 👈 opdater lokal state
        return created
        console.log("restaurant been created: "+created)
    } catch (err) {
      error.value = 'Kunne ikke oprette restaurant'
      console.error(err)
      throw err
    }
  }

  const updateRestaurant = async (id: number | string, payload: any) => {
    try {
      const updated = await put(`/restaurants/${id}`, payload)
      restaurant.value = updated
      return updated
      console.log("restaurant been updated: "+updated)
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

  return {
    restaurant,
    restaurants,
    loading,
    error,
    fetchAllRestaurants,
    fetchRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
  }
}
