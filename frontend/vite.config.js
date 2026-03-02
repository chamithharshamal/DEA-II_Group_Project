import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward all /api/admins and /api/departments calls to admin-service
      '/api/admins': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
      '/api/departments': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
