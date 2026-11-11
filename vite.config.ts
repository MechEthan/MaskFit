import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative paths so the app works at any URL, including GitHub Pages (username.github.io/repo-name/).
  base: './',
});
