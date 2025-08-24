import { ServiceLocator } from '@todo/container';
import { EThemeColor, IThemeService } from '@todo/interface';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { NuxtLayout, NuxtPage } from '#components';
import { getThemeColor } from '#shared/actions';

import 'vue-sonner/style.css';

export default defineComponent({
  name: 'App',
  setup() {
    ServiceLocator.default.get(IThemeService).initialize();

    const { locale } = useI18n();
    const { data: themeColor } = useAsyncData('theme-color', getThemeColor, {
      default: () => EThemeColor.NEUTRAL,
    });

    useHead({
      htmlAttrs: { lang: locale, class: computed(() => `theme-${themeColor.value}`) },
    });

    return () => (
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    );
  },
});
