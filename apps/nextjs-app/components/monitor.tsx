'use client';

import type { ELocaleType } from '@/i18n';

// eslint-disable-next-line import/named -- It's OK to use named imports here
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { distinctUntilChanged, ReplaySubject, shareReplay } from 'rxjs';

import { initialize } from '@/services/register-client';

const localeSubject = new ReplaySubject<ELocaleType>(1);
const translationFormattingSubject = new ReplaySubject<ReturnType<typeof useTranslations>>(1);

/**
 * user language changed notification
 */
export const language$ = localeSubject.pipe(distinctUntilChanged(), shareReplay(1));
/**
 * global
 */
export const t$ = translationFormattingSubject.pipe(distinctUntilChanged(), shareReplay(1));

export const GlobalMonitor = () => {
  initialize();

  const locale = useLocale();
  useEffect(() => {
    localeSubject.next(locale as ELocaleType);
  }, [locale]);

  const t = useTranslations();
  useMemo(() => {
    translationFormattingSubject.next(t);
  }, [t]);

  return null;
};
