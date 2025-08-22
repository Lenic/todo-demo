import {
  BehaviorSubject,
  concatMap,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  map,
  of,
  share,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { createI18n } from 'vue-i18n';

import { ELocaleType } from './types';
import { CURRENT_LANGUAGE_KEY } from './constants';

/**
 * the i18n instance
 *
 * - it will be initialized with the default locale
 */
const intl = createI18n({
  legacy: false,
  locale: ELocaleType.EN_US,
  fallbackLocale: ELocaleType.EN_US,
  messages: {},
});

/**
 * the locale trigger
 *
 * - it will be used to trigger the i18n instance to update the locale
 */
const localeTrigger = new BehaviorSubject<ELocaleType | null>(null);

/**
 * set the locale
 *
 * @param locale the locale to set
 * @returns the promise of the i18n instance that is updated
 */
export const setLocale = async (locale: ELocaleType) => {
  if (localeTrigger.getValue() === locale) return intl;

  const wait = firstValueFrom(changeableIntl$.pipe(take(1)));
  localeTrigger.next(locale);

  return await wait;
};

/**
 * the language cache
 */
const languageCache: Partial<Record<ELocaleType, Record<string, string>>> = {};
/**
 * the changeable i18n instance
 *
 * - it wouldn't push any value if the locale is not set after subscribing this variable
 */
const changeableIntl$ = localeTrigger.pipe(
  filter((locale) => locale !== null),
  distinctUntilChanged(),
  concatMap((locale) => {
    const setLocale = (messages: Record<string, string>) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_LANGUAGE_KEY, locale);
      }

      if (intl.global.locale.value !== locale) {
        intl.global.locale.value = locale;
        intl.global.setLocaleMessage(locale, messages);
      }
    };

    const cachedMessages = languageCache[locale];
    if (cachedMessages) {
      setLocale(cachedMessages);

      return of(intl);
    }

    return from(import(`./dist/${locale}.json`)).pipe(
      map((val: { default: Record<string, string> }) => {
        languageCache[locale] = val.default;
        setLocale(val.default);

        return intl;
      }),
    );
  }),
  share(),
);

/**
 * the i18n instance
 *
 * - it won't be updated forever
 */
const intl$ = changeableIntl$.pipe(distinctUntilChanged(), shareReplay(1));
intl$.subscribe();

/**
 * the user language changed notification
 */
export const language$ = changeableIntl$.pipe(
  startWith(null),
  switchMap((v) => (v ? of(v) : intl$)),
  map((v) => v.global.locale.value as ELocaleType),
  shareReplay({ bufferSize: 1, refCount: true }),
);
