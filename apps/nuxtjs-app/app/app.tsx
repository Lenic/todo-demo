import { ServiceLocator } from '@todo/container';
import { EThemeColor, IThemeService } from '@todo/interface';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClientOnly, NuxtLayout, NuxtPage } from '#components';
import { getThemeColor } from '~/actions';

import { GlobalMonitor } from './components/monitor';

import 'vue-sonner/style.css';

export default defineComponent({
  name: 'App',
  setup() {
    const { locale } = useI18n();
    const { data: themeColor } = useAsyncData(
      'theme-color',
      async () => {
        const color = await getThemeColor();
        ServiceLocator.default.get(IThemeService).setColor(color);
        return color;
      },
      { default: () => EThemeColor.NEUTRAL },
    );

    useHead({
      htmlAttrs: { lang: locale, class: computed(() => `theme-${themeColor.value}`) },
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
