import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/; the deploy workflow sets
  // BASE_PATH. Locally (and on most other hosts) the site lives at /.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { three: ['three'] },
      },
    },
  },
});
