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
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})