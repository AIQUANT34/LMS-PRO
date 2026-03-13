import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Don't rewrite the path - keep /api prefix
      },
      '/s3-upload': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // Don't rewrite the path - keep /s3-upload prefix
      },
    },
  },
})
