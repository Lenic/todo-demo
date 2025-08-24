import { COOKIE_NAME, CURRENT_LANGUAGE_KEY, getI18nInstance, parseLocale } from '~/i18n';

export default defineNuxtPlugin(async (nuxtApp) => {
  const locale = useCookie(COOKIE_NAME, {
    default: () => parseLocale(localStorage.getItem(CURRENT_LANGUAGE_KEY) ?? navigator.language),
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });

  const intl = await getI18nInstance(locale.value);
  nuxtApp.vueApp.use(intl);
});
