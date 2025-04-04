'use client';

import type { ELocaleType } from './types';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { distinctUntilChanged, ReplaySubject, shareReplay } from 'rxjs';

const subject = new ReplaySubject<ELocaleType>(1);

/**
 * user language changed notification
 */
export const language$ = subject.pipe(distinctUntilChanged(), shareReplay(1));

export const LocaleChangeMonitor = () => {
  const locale = useLocale();

  useEffect(() => {
    subject.next(locale as ELocaleType);
  }, [locale]);

  return null;
};
