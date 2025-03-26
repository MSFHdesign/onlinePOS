import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import type { ProductFormData } from '@/types/Product'

export function useProduct() {
  const { get, post, put, del } = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const product = ref<ProductFormData | null>(null)

  const fetchProduct = async (id: string | number) => {
    loading.value = true
    error.value = null

    try {
      const data = await get(`/products/${id}`)

      product.value = {
        name: data.name,
        description: data.description ?? '',
        price: parseFloat(data.price),
        vat: parseFloat(data.vat),
        tag_name: data.tag_name ?? '',
        tag_color: data.tag_color ?? '#6466f1',
      }
    } catch (err: any) {
      console.error('Fejl ved hentning af produkt:', err)
      error.value = 'Der opstod en fejl ved hentning af produktet.'
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string | number, payload: ProductFormData) => {
    return put(`/products/${id}`, payload)
  }

  const createProduct = async (payload: ProductFormData) => {
    return post('/products', payload)
  }

  const deleteProduct = async (id: string | number) => {
    return del(`/products/${id}`)
  }

  return {
    product,
    loading,
    error,
    fetchProduct,
    updateProduct,
    createProduct,
    deleteProduct
  }
}
