import { COOKIE_NAME, CURRENT_LANGUAGE_KEY, getLocale, setLocale } from '@/i18n';

export default defineNuxtPlugin(async (nuxtApp) => {
  const locale = useCookie(COOKIE_NAME, {
    default: () => getLocale(localStorage.getItem(CURRENT_LANGUAGE_KEY) ?? navigator.language),
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });

  const intl = await setLocale(locale.value);
  nuxtApp.vueApp.use(intl);
});
