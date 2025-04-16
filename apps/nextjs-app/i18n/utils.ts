'use server';

import type { ELocaleType } from './types';

import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { COOKIE_NAME, DEFAULT_LOCALE } from './constants';

export const getUserLocale = async () => (await cookies()).get(COOKIE_NAME)?.value ?? DEFAULT_LOCALE;

export const setUserLocale = async (locale: ELocaleType) => void (await cookies()).set(COOKIE_NAME, locale);

export const getIntl = async (key = '') => {
  const t = await getTranslations(key);
  const n = (suffix: string) => `#${key}.${suffix}#`;

  return { t, n };
};
