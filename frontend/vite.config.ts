import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('@google/genai')) {
            return 'vendor-ai';
          }
          if (id.includes('motion')) {
            return 'vendor-motion';
          }
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          return 'vendor';
        },
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify; file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
