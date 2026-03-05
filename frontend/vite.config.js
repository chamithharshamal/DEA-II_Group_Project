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
      '/api/staff': {
        target: 'http://localhost:8089',
        changeOrigin: true,
        secure: false,
      },
      '/api/notifications': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
      '/api/doctors': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        secure: false,
      },
      '/api/pharmacists': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
      '/api/medications': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
      '/api/prescriptions': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
      '/api/billings': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        secure: false,
      },
      '/api/lab-reports': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/lab-reports/, '/api/lab-reports'),
      },
      '/api/patients': {
        target: 'http://localhost:8087',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})