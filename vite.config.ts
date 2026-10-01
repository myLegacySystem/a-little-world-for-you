import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TEXT } from './src/content/text';

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/; the deploy workflow sets
  // BASE_PATH. Locally (and on most other hosts) the site lives at /.
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    {
      // The page title and the no-JavaScript message come from content/text.ts too.
      name: 'content-in-html',
      transformIndexHtml: (html) =>
        html.replace('%PAGE_TITLE%', escape(TEXT.PAGE_TITLE)).replace('%NO_JAVASCRIPT%', escape(TEXT.NO_JAVASCRIPT)),
    },
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { three: ['three'] },
      },
    },
  },
});
