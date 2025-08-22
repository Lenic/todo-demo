import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  map,
  mergeScan,
  of,
  shareReplay,
  tap,
  zip,
} from 'rxjs';
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

export const localeTrigger = new BehaviorSubject(intl.global.locale as ELocaleType);

let isProcessing = false;
const upriver$ = localeTrigger.pipe(
  filter(() => !isProcessing),
  tap(() => void (isProcessing = true)),
  shareReplay(1),
);
const intl$ = zip(
  upriver$,
  upriver$.pipe(
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
    tap(() => void (isProcessing = false)),
  ),
).pipe(
  map(([locale, store]) => {
    const messages = store[locale];
    if (!messages) return;
    if (messages instanceof Promise) return;

    intl.global.setLocaleMessage(locale, messages);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_LANGUAGE_KEY, locale);
    }

    if (intl.global.locale !== locale) {
      intl.global.locale = locale;
    }

    return intl;
  }),
  distinctUntilChanged(),
  shareReplay(1),
);
intl$.subscribe();

export const intlPromise = firstValueFrom(intl$);

/**
 * user language changed notification
 */
export const language$ = intl$.pipe(filter(v => !!v), map(v => v.global.locale), shareReplay(1));