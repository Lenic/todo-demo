import { COOKIE_NAME, getLocale, setLocale } from '@/i18n';

export default defineNuxtPlugin(async (nuxtApp) => {
  const event = useRequestEvent();
  if (!event) return;

  const locale = useCookie(COOKIE_NAME, {
    default: () => getLocale(event.headers.get('accept-language')),
    secure: true,
    sameSite: 'lax',
  });

  const intl = await setLocale(locale.value);
  nuxtApp.vueApp.use(intl);
});
