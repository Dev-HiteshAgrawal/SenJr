import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion') || id.includes('react-hot-toast')) {
              return 'ui-vendor';
            }
            return 'vendor'; // Fallback for other node_modules
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
