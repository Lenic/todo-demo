import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

import { languageFilesIntegrationPlugin } from './src/i18n/core';
import { autoAlias } from './auto-alias';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [languageFilesIntegrationPlugin, solid()],
  resolve: { alias: [autoAlias] },
});
