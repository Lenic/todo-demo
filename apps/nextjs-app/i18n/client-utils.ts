'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

export const useIntl = (key = '') => {
  const t = useTranslations(key);

  const n = useCallback((suffix: string) => `#${key}.${suffix}#`, [key]);

  return { t, n };
};
