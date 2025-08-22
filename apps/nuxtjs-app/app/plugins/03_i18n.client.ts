import { intl$ } from '@/i18n';
import { firstValueFrom } from 'rxjs';

export default defineNuxtPlugin({
  name: 'i18n-plugin',
  async setup(nuxtApp) {
    const intl = await firstValueFrom(intl$);
    nuxtApp.vueApp.use(intl);
  },
});
