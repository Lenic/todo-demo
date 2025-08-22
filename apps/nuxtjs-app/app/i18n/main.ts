import { BehaviorSubject, concatMap, distinctUntilChanged, filter, from, map, of, shareReplay } from 'rxjs';
import { createI18n } from 'vue-i18n';

import { ELocaleType } from './types';

const CURRENT_LANGUAGE_KEY = 'CURRENT_LANGUAGE_KEY';

/**
 * get default locale from localStorage or navigator.language
 *
 * - if localStorage is not set, use navigator.language
 * - if navigator.language is not set, use ELocaleType.EN_US
 */
let defaultLocale = ELocaleType.EN_US;
if (typeof window !== 'undefined') {
  defaultLocale = (localStorage.getItem(CURRENT_LANGUAGE_KEY) ?? navigator.language) as ELocaleType;
}

/**
 * the i18n instance
 *
 * - it will be initialized with the default locale
 */
export const intl = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {},
});

/**
 * the locale trigger
 *
 * - it will be used to trigger the i18n instance to update the locale
 */
export const localeTrigger = new BehaviorSubject<ELocaleType | null>(
  typeof window === 'undefined' ? null : defaultLocale
);

/**
 * the language cache
 */
const languageCache: Partial<Record<ELocaleType, Record<string, string>>> = {};
/**
 * the i18n instance
 *
 * - it won't be updated forever
 * - it will be used to get the i18n instance
 */
export const intl$ = localeTrigger.pipe(
  filter((locale) => locale !== null),
  distinctUntilChanged(),
  concatMap((locale) => {
    const cachedMessages = languageCache[locale];

    const setLocale = (messages: Record<string, string>) => {
      intl.global.setLocaleMessage(locale, messages);

      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_LANGUAGE_KEY, locale);
      }

      if (intl.global.locale.value !== locale) {
        intl.global.locale.value = locale;
      }
    };

    if (cachedMessages) {
      setLocale(cachedMessages);

      return of(intl);
    }

    return from(import(`./dist/${locale}.json`)).pipe(
      map((val: { default: Record<string, string> }) => {
        languageCache[locale] = val.default;
        setLocale(val.default);

        return intl;
      })
    );
  }),
  distinctUntilChanged(),
  shareReplay(1)
);
intl$.subscribe();

/**
 * the user language changed notification
 *
 * - it will be used to get the user language
 */
export const language$ = intl$.pipe(
  map((v) => v.global.locale.value),
  shareReplay(1)
);
