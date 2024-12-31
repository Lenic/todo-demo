import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import { defineConfig } from 'vite';

import { languageFilesIntegrationPlugin } from './src/i18n/core';
import { autoAlias } from './auto-alias';

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [languageFilesIntegrationPlugin, vue(), vueJsx()],
  resolve: { alias: [autoAlias] },
});
