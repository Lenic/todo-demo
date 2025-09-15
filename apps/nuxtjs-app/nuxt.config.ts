import tailwindcss from '@tailwindcss/vite';

import { languageFilesIntegrationPlugin } from './app/i18n/core';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/tailwind.css'],

  experimental: {
    asyncContext: true,
  },

  vite: {
    plugins: [tailwindcss(), languageFilesIntegrationPlugin],
  },

  runtimeConfig: {
    databaseUrl: '',

    pusherId: '',
    pusherSecret: '',

    public: {
      pusherKey: '',
      pusherCluster: '',
    },
  },
});
