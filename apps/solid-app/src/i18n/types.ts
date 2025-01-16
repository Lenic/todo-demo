import type { Observable } from 'rxjs';

export enum ELocaleType {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
  JA_JP = 'ja-JP',
}

export type TI18nTranslate = (key: string, literal?: Record<string, string>) => string;

export type TLanguageStore = Record<ELocaleType, Record<string, string> | undefined>;

export interface ILocaleController {
  language$: Observable<ELocaleType>;
  messages$: Observable<Record<string, string>>;

  language: ELocaleType;
  ready: Promise<boolean>;
  messages: Record<string, string>;

  setLocale: (locale: ELocaleType) => void;
}
