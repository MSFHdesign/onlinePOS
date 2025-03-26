// src/composables/useApi.ts
import axios from 'axios'

const API_BASE = window.location.hostname === 'localhost'
  ? '/api'
  : import.meta.env.VITE_API_URL

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
      throw error
    }
  }

  const put = async (path: string, data: any) => {
    try {
      const res = await axios.put(`${API_BASE}${path}`, data)
      return res.data
    } catch (error) {
      console.error('PUT fejl:', error)
      throw error
    }
  }

  const del = async (path: string) => {
    try {
      const res = await axios.delete(`${API_BASE}${path}`)
      return res.data
    } catch (error) {
      console.error('DELETE fejl:', error)
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
