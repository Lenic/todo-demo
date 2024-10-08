import i18next from 'i18next';
import { Observable, shareReplay } from 'rxjs';

import { ELocaleType } from './types';
/**
 * the list of supported language names
 */
export const LANGUAGE_LIST = [ELocaleType.EN_US, ELocaleType.ZH_CN];

const language$ = new Observable<ELocaleType>((observer) => {
  const action = (lang: ELocaleType) => observer.next(lang);

  i18next.on('languageChanged', action);
  observer.next(i18next.language as ELocaleType);

  return () => {
    i18next.off('languageChanged', action);
  };
});
/**
 * user language changed notification
 */
export const languageChanged$ = language$.pipe(shareReplay(1));
