import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Force dependency pre-bundling
  optimizeDeps: {
    force: true
  },
  // Clear the cache on start
  server: {
    hmr: {
      overlay: false
    }
  }
});
