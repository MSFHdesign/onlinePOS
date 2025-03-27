import { ref } from 'vue'
import { useApi } from './useApi'

export function useRestaurant() {
  const { get, put, post, del } = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const restaurant = ref<any>({
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

  const restaurants = ref([])

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
      if (id) {
        restaurant.value = await get(`/restaurants/${id}`)
      } else {
        const list = await get('/restaurants')
        if (list.length > 0) {
          restaurant.value = list[0] // tag første hvis ID ikke er givet
        } else {
          restaurant.value = {
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
          }
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
    return post('/restaurants', payload)
  }

  const updateRestaurant = async (id: number | string, payload: any) => {
    return put(`/restaurants/${id}`, payload)
  }

  const deleteRestaurant = async (id: number | string) => {
    return del(`/restaurants/${id}`)
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
