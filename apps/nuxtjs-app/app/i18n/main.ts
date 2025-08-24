import type { DefaultLocaleMessageSchema, I18n } from 'vue-i18n';

import { concatMap, filter, firstValueFrom, from, map, of, share, Subject } from 'rxjs';
import { createI18n } from 'vue-i18n';

import { CURRENT_LANGUAGE_KEY } from './constants';
import { ELocaleType } from './types';

const localeTrigger = new Subject<ELocaleType>();
const messagesStore: Partial<Record<ELocaleType, Record<string, DefaultLocaleMessageSchema>>> = {};
const intlStore: Partial<
  Record<ELocaleType, I18n<Record<string, DefaultLocaleMessageSchema>, {}, {}, ELocaleType, false>>
> = {};

const message$ = localeTrigger.pipe(
  concatMap((locale) => {
    const message = messagesStore[locale];
    if (message) return of([locale, message] as const);

    return from(import(`./dist/${locale}.json`)).pipe(
      concatMap((val: { default: Record<string, DefaultLocaleMessageSchema> }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(CURRENT_LANGUAGE_KEY, locale);
        }

        messagesStore[locale] = val.default;
        return of([locale, val.default] as const);
      }),
    );
  }),
  share(),
);

const intl$ = message$.pipe(
  map(([locale, message]) => {
    let intl = intlStore[locale];
    if (intl) return intl;

    intl = createI18n({
      legacy: false,
      locale,
      fallbackLocale: ELocaleType.EN_US,
      messages: { [locale]: message },
    });
    intlStore[locale] = intl;
    return intl;
  }),
  share(),
);

/**
 * get the i18n instance
 *
 * @param locale - the target locale which is the same as the result's locale
 */
export const getI18nInstance = (locale: ELocaleType) => {
  const wait = firstValueFrom(intl$.pipe(filter((v) => v.global.locale.value === locale)));
  localeTrigger.next(locale);

  return wait;
};

/**
 * get the message of the locale
 *
 * @param locale - the target locale
 */
export const loadI18nMessages = async (locale: ELocaleType) => {
  const wait = firstValueFrom(
    message$.pipe(
      filter((v) => v[0] === locale),
      map((v) => v[1]),
    ),
  );
  localeTrigger.next(locale);

  return wait;
};
