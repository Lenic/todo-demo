import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import { autoAlias } from './auto-alias';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [solid()],
  resolve: { alias: [autoAlias] },
});
