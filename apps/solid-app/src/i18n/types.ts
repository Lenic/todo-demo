export enum ELocaleType {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US',
  JA_JP = 'ja-JP',
}

export type TI18nTranslate = (key: string, literal?: Record<string, string>) => string;
