import { CURRENT_LANGUAGE_KEY } from './constants';
import { ELocaleType } from './types';

const localeList: string[] = Object.values(ELocaleType);
const localeSet = new Set(localeList);
const shortLocaleSet = new Set(localeList.map((locale) => locale.split('-')[0]));

/**
 * get the locale from the accept-language header
 *
 * @param acceptLanguage - the accept-language header
 */
export const getLocale = (acceptLanguage: string | null) => {
  if (!acceptLanguage) return ELocaleType.EN_US;

  // en-US,en;q=0.9,ja;q=0.8,zh;q=0.7
  const locales = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, qValue] = lang.trim().split(';q=');
      return !code ? null : { code, q: qValue ? parseFloat(qValue) : 1 };
    })
    .filter((locale) => !!locale)
    .sort((a, b) => b.q - a.q)
    .map((locale) => locale.code);

  for (const locale of locales) {
    if (localeSet.has(locale)) return locale as ELocaleType;

    const shortCode = locale.split('-')[0];
    if (shortCode && shortLocaleSet.has(shortCode)) return shortCode as ELocaleType;
  }

  return ELocaleType.EN_US;
};

/**
 * get the local from the client side.
 */
export const getClientLocale = () => {
  if (typeof window === 'undefined') {
    throw new Error('getClientLocale is only available on the client side');
  }

  return getLocale(localStorage.getItem(CURRENT_LANGUAGE_KEY) ?? navigator.language);
};
