import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/main.tsx',
        login: 'src/pages/Login.tsx',
        clients: 'src/pages/Clients.tsx'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      components: '/src/components',
      pages: '/src/pages',
      lib: '/src/lib'
    }
  }
})
