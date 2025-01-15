import type { ELocaleType } from './types';

import { flatten } from '@solid-primitives/i18n';
import {
  BehaviorSubject,
  concatMap,
  distinctUntilChanged,
  EMPTY,
  firstValueFrom,
  from,
  map,
  mergeScan,
  of,
  shareReplay,
  zip,
} from 'rxjs';

const CURRENT_LANGUAGE_KEY = 'CURRENT_LANGUAGE_KEY';

type TLanguageStore = Record<ELocaleType, Record<string, string> | Promise<Record<string, string>> | undefined>;

const initialLanguage =
  (typeof window !== 'undefined' && localStorage.getItem(CURRENT_LANGUAGE_KEY)) ?? navigator.language;
export const localeTrigger = new BehaviorSubject(initialLanguage as ELocaleType);

export const messages$ = zip(
  localeTrigger,
  localeTrigger.pipe(
    mergeScan((acc, locale) => {
      const item = acc[locale];
      if (!item) {
        return from(import(`./dist/${locale}.json`)).pipe(
          map((val: { default: Record<string, string> }) => {
            acc[locale] = flatten(val.default);
            return acc;
          }),
        );
      }
      return of(acc);
    }, {} as TLanguageStore),
  ),
).pipe(
  concatMap(([locale, store]) => {
    const messages = store[locale];
    if (!messages) return EMPTY;
    if (messages instanceof Promise) return EMPTY;

    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_LANGUAGE_KEY, locale);
    }

    return of(messages);
  }),
  distinctUntilChanged(),
  shareReplay(1),
);

/**
 * user language changed notification
 */
export const language$ = messages$.pipe(map(() => localeTrigger.getValue()));

export const intlPromise = firstValueFrom(messages$);
