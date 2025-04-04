'use server';

import type { ELocaleType } from './types';

import { cookies } from 'next/headers';

import { COOKIE_NAME, DEFAULT_LOCALE } from './constants';

export const getUserLocale = async () => (await cookies()).get(COOKIE_NAME)?.value ?? DEFAULT_LOCALE;

export const setUserLocale = async (locale: ELocaleType) => void (await cookies()).set(COOKIE_NAME, locale);
