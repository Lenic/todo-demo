import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { getThemeColor } from '~/actions';
import { ClientOnly, NuxtLayout, NuxtPage } from '#components';

import { GlobalMonitor } from './components/monitor';
import { useAuth } from './hooks';

import 'vue-sonner/style.css';

export default defineComponent({
  name: 'App',
  setup() {
    const { locale } = useI18n();

    const { session } = useAuth();
    const headers = useRequestHeaders();
    const { data: themeColor } = useAsyncData('themeColor', async () => {
      const color = await getThemeColor(headers, session.value)();
      ServiceLocator.default.get(IThemeService).setColor(color);
      return color;
    });

    useHead({
      htmlAttrs: { lang: locale, class: computed(() => `theme-${themeColor.value ?? 'unknown'}`) },
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
