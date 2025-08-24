import type { useI18n } from 'vue-i18n';

import { distinctUntilChanged, ReplaySubject, shareReplay } from 'rxjs';

export const socketIdSubject = new ReplaySubject<string>(1);
export const translationFormattingSubject = new ReplaySubject<ReturnType<typeof useI18n>['t']>(1);
export const channelIdSubject = new ReplaySubject<string>(1);

/**
 * global i18n translation notification
 */
export const t$ = translationFormattingSubject.pipe(distinctUntilChanged(), shareReplay(1));
