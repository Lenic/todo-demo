import { useI18n } from 'vue-i18n';

export const useIntl = (prefix: string) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method -- it's ok
  const { t, locale, setLocaleMessage } = useI18n();

  const handleTranslate = (key: string, literal: Record<string, unknown> = {}) => t(`${prefix}.${key}`, literal);

  /**
   * Custom rule of the form error message: It's the i18n key if it starts and ends with the '#' symbol.
   */
  const handleTransform = (key: string) => `#${prefix}.${key}#`;

  return { t: handleTranslate, n: handleTransform, locale, setLocaleMessage };
};
