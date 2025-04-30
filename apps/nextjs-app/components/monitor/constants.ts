import type { ELocaleType } from '@/i18n';
import type { useTranslations } from 'next-intl';

import { distinctUntilChanged, ReplaySubject, shareReplay } from 'rxjs';

export const socketIdSubject = new ReplaySubject<string>(1);
export const localeSubject = new ReplaySubject<ELocaleType>(1);
export const translationFormattingSubject = new ReplaySubject<ReturnType<typeof useTranslations>>(1);
export const channelIdSubject = new ReplaySubject<string>(1);

/**
 * user language changed notification
 */
export const language$ = localeSubject.pipe(distinctUntilChanged(), shareReplay(1));
/**
 * global i18n translation notification
 */
export const t$ = translationFormattingSubject.pipe(distinctUntilChanged(), shareReplay(1));
