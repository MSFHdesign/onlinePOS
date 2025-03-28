import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Product } from '@/types/Product'

export function useProducts() {
  const { get, post } = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const products = ref<Product[]>([])

  // Featured product is the first by sort_order
  const featuredProduct = computed(() => {
    if (products.value.length === 0) return null
    
    // Sort products by sort_order to get the featured one
    return [...products.value]
      .sort((a, b) => {
        // Handle null or undefined sort_order values
        const sortA = typeof a.sort_order === 'number' ? a.sort_order : Infinity
        const sortB = typeof b.sort_order === 'number' ? b.sort_order : Infinity
        return sortA - sortB
      })[0]
  })

  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      // Build URL with query parameters
      const queryParams = new URLSearchParams(params as Record<string, string>).toString()
      const url = queryParams ? `/products?${queryParams}` : '/products'
      
      const response = await get(url)
      
      // Handle different response formats
      if (response.success && Array.isArray(response.data)) {
        // New format: { success: true, data: [...] }
        products.value = response.data
      } else if (Array.isArray(response)) {
        // Old format: direct array
        products.value = response
      } else {
        console.error('Unexpected response format:', response)
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      console.error('Error fetching products:', err)
      error.value = 'An error occurred while fetching products.'
    } finally {
      loading.value = false
    }
  }

  const fetchFeaturedProduct = async () => {
    loading.value = true
    error.value = null

    try {
      // First, try to find a product that is explicitly marked as featured
      const featuredParams = {
        is_featured: 'true'
      }
      const featuredQueryParams = new URLSearchParams(featuredParams).toString()
      const featuredUrl = `/products?${featuredQueryParams}`
      
      let response = await get(featuredUrl)
      
      // Check if we found any explicitly featured products
      let featuredProduct = null
      
      // Handle different response formats for explicitly featured products
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        // New format with explicitly featured product
        featuredProduct = response.data[0]
      } else if (Array.isArray(response) && response.length > 0) {
        // Old format with explicitly featured product
        featuredProduct = response[0]
      } else {
        // If no explicitly featured products, fall back to sort_order
        // but only for products that have a specific sort_order set
        const params = {
          sort_by: 'sort_order',
          sort_direction: 'asc',
          limit: '1'
        }
        const queryParams = new URLSearchParams(params).toString()
        const url = `/products?${queryParams}`
        
        response = await get(url)
        
        // Handle different response formats for sort_order based featured product
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          // Check if the product has a sort_order
          const product = response.data[0]
          if (product.sort_order !== undefined && product.sort_order !== null) {
            featuredProduct = product
          }
        } else if (Array.isArray(response) && response.length > 0) {
          // Check if the product has a sort_order
          const product = response[0]
          if (product.sort_order !== undefined && product.sort_order !== null) {
            featuredProduct = product
          }
        }
      }
      
      return featuredProduct
    } catch (err: any) {
      console.error('Error fetching featured product:', err)
      error.value = 'An error occurred while fetching featured product.'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProductOrder = async (productIds: number[]) => {
    try {
      return await post('/products/sort', { order: productIds })
    } catch (err: any) {
      console.error('Error updating product order:', err)
      error.value = 'An error occurred while updating product order.'
      throw err
    }
  }

  return {
    products,
    loading,
    error,
    featuredProduct,
    fetchProducts,
    fetchFeaturedProduct,
    updateProductOrder
  }
} 