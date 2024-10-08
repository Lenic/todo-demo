import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE_LIST } from './constants';
import { ELocaleType } from './types';

export const intl = i18next
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string) => import(`./dist/${language}.json`)))
  .use(initReactI18next)
  .init({
    supportedLngs: LANGUAGE_LIST,
    fallbackLng: ELocaleType.EN_US,
  });
