import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

import { languageFilesIntegrationPlugin } from './src/i18n/core';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [languageFilesIntegrationPlugin, react({ tsDecorators: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
