'use client';

import '@/services/register-client';

import type { IGlobalMonitorProps } from './types';
import type { ELocaleType } from '@/i18n';

// eslint-disable-next-line import/named -- It's OK to use named imports here
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

import { channelIdSubject, localeSubject, translationFormattingSubject } from './constants';

export const GlobalMonitor = ({ channelId }: IGlobalMonitorProps) => {
  useEffect(() => {
    channelIdSubject.next(channelId);
  }, [channelId]);

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
