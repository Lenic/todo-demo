import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: { lib: { entry: './src/index.ts', name: 'umd' } },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
