import { BehaviorSubject, from, map, mergeScan, of, zip } from 'rxjs';
import { createI18n } from 'vue-i18n';

import { ELocaleType } from './types';

const CURRENT_LANGUAGE_KEY = 'CURRENT_LANGUAGE_KEY';

type TLanguageStore = Record<ELocaleType, Record<string, string> | Promise<Record<string, string>> | undefined>;

export const intl = createI18n({
  legacy: false,
  // @ts-expect-error 2304 -- fix the `navigator` problem
  locale: (typeof window !== 'undefined' && localStorage.getItem(CURRENT_LANGUAGE_KEY)) ?? navigator.language,
  fallbackLocale: ELocaleType.EN_US,
  messages: {},
});

const localTrigger = new BehaviorSubject(intl.global.locale.value as ELocaleType);
export const setLocale = (locale: ELocaleType) => {
  localTrigger.next(locale);
};

export const intlPromise = new Promise<typeof intl>((resolve, reject) => {
  zip(
    localTrigger,
    localTrigger.pipe(
      mergeScan((acc, locale) => {
        const item = acc[locale];
        if (!item) {
          return from(import(`./dist/${locale}.json`)).pipe(
            map((val: { default: Record<string, string> }) => {
              acc[locale] = val.default;
              return acc;
            }),
          );
        }
        return of(acc);
      }, {} as TLanguageStore),
    ),
  ).subscribe({
    next([locale, store]) {
      const messages = store[locale];
      if (!messages) return;
      if (messages instanceof Promise) return;

      intl.global.setLocaleMessage(locale, messages);
      // @ts-expect-error 2304 -- fix the `window` problem
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_LANGUAGE_KEY, locale);
      }

      if (intl.global.locale.value !== locale) {
        intl.global.locale.value = locale;
      }

      resolve(intl);
    },
    error() {
      reject(new Error('load i18n error.'));
    },
  });
});
