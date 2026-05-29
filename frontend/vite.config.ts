import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
    }),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})