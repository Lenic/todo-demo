import { EThemeColor } from '@todo/interface';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClientOnly, NuxtLayout, NuxtPage } from '#components';

import { GlobalMonitor } from './components/monitor';
import { useAuth, useThemeColor } from './hooks';

import 'vue-sonner/style.css';

export default defineComponent({
  name: 'App',
  setup() {
    const { locale } = useI18n();

    const { session } = useAuth();
    const themeColor = useThemeColor();

    useHead({
      htmlAttrs: { lang: locale, class: `theme-${themeColor.value ?? EThemeColor.NEUTRAL}` },
    });

    return () => (
      <NuxtLayout>
        <NuxtPage />
        <ClientOnly>
          <GlobalMonitor channelId={session.value?.user?.id ?? ''} />
        </ClientOnly>
      </NuxtLayout>
    );
  },
});
