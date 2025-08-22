import { ELocaleType, intl$, localeTrigger } from '@/i18n';
import { firstValueFrom } from 'rxjs';

export default defineNuxtPlugin({
  name: 'i18n-plugin',
  async setup(nuxtApp) {
    const headers = useRequestHeaders();

    const locale = (headers['accept-language']?.split(',')[0] as ELocaleType) ?? ELocaleType.EN_US;
    if (!localeTrigger.getValue()) {
      localeTrigger.next(locale);
    }

    const intl = await firstValueFrom(intl$);
    nuxtApp.vueApp.use(intl);
  },
});
