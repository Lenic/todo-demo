import { Observable, shareReplay } from 'rxjs';
import { effectScope, watch } from 'vue';

import { intl } from './main';
import { ELocaleType } from './types';
/**
 * the list of supported language names
 */
export const LANGUAGE_LIST = [ELocaleType.EN_US, ELocaleType.ZH_CN, ELocaleType.JA_JP];

/**
 * user language changed notification
 */
export const language$ = new Observable<string>((observer) => {
  const scope = effectScope(true);

  const cleanupFn = scope.run(() => {
    watch(
      intl.global.locale,
      (locale) => {
        observer.next(locale);
      },
      { immediate: true },
    );

    return () => {
      observer.complete();
    };
  });

  return () => {
    cleanupFn?.();
  };
}).pipe(shareReplay(1));
