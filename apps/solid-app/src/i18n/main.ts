import type { ILocaleController, TLanguageStore } from './types';
import type { Observable } from 'rxjs';

import { flatten } from '@solid-primitives/i18n';
import { areArraysEqual } from '@todo/controllers';
import {
  BehaviorSubject,
  catchError,
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

import { CURRENT_LANGUAGE_KEY, LANGUAGE_LIST } from './constants';
import { ELocaleType } from './types';

class LocaleController implements ILocaleController {
  private localeTrigger: BehaviorSubject<ELocaleType>;

  language$: Observable<ELocaleType>;
  messages$: Observable<Record<string, string>>;

  language: ELocaleType;
  ready: Promise<boolean>;
  messages: Record<string, string>;

  constructor() {
    const locale = (typeof window !== 'undefined' && localStorage.getItem(CURRENT_LANGUAGE_KEY)) ?? navigator.language;

    this.language = LANGUAGE_LIST.includes(locale as ELocaleType) ? (locale as ELocaleType) : ELocaleType.EN_US;
    this.localeTrigger = new BehaviorSubject(this.language);

    const localeAndMessages$ = this.buildLocaleAndMessage$();

    this.messages$ = localeAndMessages$.pipe(map(([, messages]) => messages));
    this.messages = {};
    this.messages$.subscribe((messages) => void (this.messages = messages));

    this.language$ = localeAndMessages$.pipe(map(([locale]) => locale));
    this.language$.subscribe((language) => void (this.language = language));

    this.ready = firstValueFrom(
      localeAndMessages$.pipe(
        map(() => true),
        catchError(() => of(false)),
      ),
    );
  }

  setLocale = (locale: ELocaleType) => {
    this.localeTrigger.next(locale);
  };

  private buildLocaleAndMessage$() {
    return zip(
      this.localeTrigger,
      this.localeTrigger.pipe(
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

        return of([locale, messages] as [ELocaleType, Record<string, string>]);
      }),
      distinctUntilChanged(areArraysEqual),
      shareReplay(1),
    );
  }
}

export const i18n: ILocaleController = new LocaleController();
