import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
      reactivityTransform: true
    })],
  resolve: {
    alias: {
     '@': fileURLToPath(new URL('./src', import.meta.url)) 
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://onlinepos-production.up.railway.app',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
