// src/composables/useApi.ts
import axios from 'axios'

// Define API base URL more clearly
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api' // Proxy setup for development
  : import.meta.env.VITE_API_URL || '/api' // Fallback to /api if env variable isn't set

// Configure axios defaults for better handling of requests
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

export function useApi() {
  const get = async (path: string) => {
    try {
      const res = await axios.get(`${API_BASE}${path}`)
      return res.data
    } catch (error) {
      console.error('GET fejl:', error)
      throw error
    }
  }

  const post = async (path: string, data: any) => {
    try {
      const res = await axios.post(`${API_BASE}${path}`, data)
      return res.data
    } catch (error) {
      console.error('POST fejl:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
        console.error('Response data:', error.response?.data)
      }
      throw error
    }
  }

  const put = async (path: string, data: any) => {
    try {
      // Try with application/json content type explicitly set
      const res = await axios.put(`${API_BASE}${path}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      return res.data
    } catch (error) {
      console.error('PUT fejl:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
        console.error('Response data:', error.response?.data)
      }
      throw error
    }
  }

  const del = async (path: string) => {
    try {
      const res = await axios.delete(`${API_BASE}${path}`)
      return res.data
    } catch (error) {
      console.error('DELETE fejl:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
        console.error('Response data:', error.response?.data)
      }
      throw error
    }
  }

  return {
    get,
    post,
    put,
    del
  }
}
