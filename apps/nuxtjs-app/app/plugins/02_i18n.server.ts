import { COOKIE_NAME, parseLocale, getI18nInstance } from '@/i18n';

export default defineNuxtPlugin(async (nuxtApp) => {
  const event = useRequestEvent();
  if (!event) return;

  const locale = useCookie(COOKIE_NAME, {
    default: () => parseLocale(event.headers.get('accept-language')),
    secure: true,
    sameSite: 'lax',
  });

  const intl = await getI18nInstance(locale.value);
  nuxtApp.vueApp.use(intl);
});
