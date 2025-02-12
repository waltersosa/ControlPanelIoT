import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      mqtt: 'mqtt/dist/mqtt.js',
    },
  },
  optimizeDeps: {
    include: ['mqtt']
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
