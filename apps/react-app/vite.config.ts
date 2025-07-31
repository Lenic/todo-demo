import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

import { languageFilesIntegrationPlugin } from './src/i18n/core';
import { autoAlias } from './auto-alias';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), languageFilesIntegrationPlugin, react({ tsDecorators: true })],
  resolve: { alias: [autoAlias] },
});
