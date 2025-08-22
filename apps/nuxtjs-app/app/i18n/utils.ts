import { ELocaleType } from './types';

const localeList: string[] = Object.values(ELocaleType);
const localeSet = new Set(localeList);
const shortLocaleSet = new Set(localeList.map((locale) => locale.split('-')[0]));

/**
 * Parse the locale from a string.
 *
 * @param pattern - string to be analyzed
 */
export const parseLocale = (pattern: string | null) => {
  if (!pattern) return ELocaleType.EN_US;

  // en-US,en;q=0.9,ja;q=0.8,zh;q=0.7
  const locales = pattern
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
