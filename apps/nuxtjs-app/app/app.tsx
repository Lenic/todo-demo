import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClientOnly, NuxtLayout, NuxtPage } from '#components';

import { GlobalMonitor } from './components/monitor';

import 'vue-sonner/style.css';

export default defineComponent({
  name: 'App',
  setup() {
    const { locale } = useI18n();
    const { $themeColor } = useNuxtApp();

    useHead({
      htmlAttrs: { lang: locale, class: computed(() => `theme-${$themeColor}`) },
    });

    return () => (
      <NuxtLayout>
        <NuxtPage />
        <ClientOnly>
          <GlobalMonitor channelId="7224a0ad-af31-4c71-81ed-7d3ef0a9423d" />
        </ClientOnly>
      </NuxtLayout>
    );
  },
});
