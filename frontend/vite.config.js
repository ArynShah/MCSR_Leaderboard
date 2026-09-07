import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/filters': {
        target: 'https://www.filteredseed.com',
        changeOrigin: true,
        rewrite: () => '/filters'
      },
      '/api/getRandomUsedSeed': {
        target: 'https://www.filteredseed.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/getRandomUsedSeed\/([^/]+)/, '/getRandomUsedSeeds/$1/1')
      }
    }
  }
})
