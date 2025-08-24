import tailwindcss from '@tailwindcss/vite';

import { languageFilesIntegrationPlugin } from './app/i18n/core';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss(), languageFilesIntegrationPlugin],
  },

  modules: ['shadcn-nuxt', 'nuxt-auth-utils'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },

  components: [
    {
      path: '~/components/ui',
      pathPrefix: false,
    },
  ],
});
