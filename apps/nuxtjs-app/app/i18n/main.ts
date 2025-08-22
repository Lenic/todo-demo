import type { DefaultLocaleMessageSchema, I18n } from 'vue-i18n';

import { concatMap, filter, firstValueFrom, from, of, share, Subject } from 'rxjs';
import { createI18n } from 'vue-i18n';

import { CURRENT_LANGUAGE_KEY } from './constants';
import { ELocaleType } from './types';

const localeTrigger = new Subject<ELocaleType>();
const intlStore: Partial<
  Record<ELocaleType, I18n<Record<string, DefaultLocaleMessageSchema>, {}, {}, ELocaleType, false>>
> = {};
const intl$ = localeTrigger.pipe(
  concatMap((locale) => {
    const intl = intlStore[locale];
    if (intl) return of(intl);

    return from(import(`./dist/${locale}.json`)).pipe(
      concatMap((val: { default: Record<string, DefaultLocaleMessageSchema> }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(CURRENT_LANGUAGE_KEY, locale);
        }

        const intl = createI18n({
          legacy: false,
          locale,
          fallbackLocale: ELocaleType.EN_US,
          messages: val.default,
        });
        intlStore[locale] = intl;
        return of(intl);
      }),
    );
  }),
  share(),
);

/**
 * get the i18n instance
 *
 * @param locale - the target locale which is the same as the result's locale
 */
export const getI18nInstance = async (locale: ELocaleType) => {
  const wait = firstValueFrom(intl$.pipe(filter((v) => v.global.locale.value === locale)));
  localeTrigger.next(locale);

  return await wait;
};
