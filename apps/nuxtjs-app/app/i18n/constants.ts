import { ELocaleType } from './types';

/**
 * the list of supported language names
 */
export const LANGUAGE_LIST = [ELocaleType.EN_US, ELocaleType.ZH_CN, ELocaleType.JA_JP];

/**
 * the locale cookie name
 */
export const COOKIE_NAME = 'NUXT_LOCALE';

/**
 * the current language key in localStorage
 */
export const CURRENT_LANGUAGE_KEY = 'CURRENT_LANGUAGE_KEY';
