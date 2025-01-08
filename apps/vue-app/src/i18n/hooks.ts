import { useI18n } from 'vue-i18n';

export const useIntl = (prefix: string) => {
  const { t } = useI18n();

  const handleTranslate = (key: string) => t(`${prefix}.${key}`);

  /**
   * Custom rule of the form error message: It's the i18n key if it starts and ends with the '#' symbol.
   */
  const handleTransform = (key: string) => `#${prefix}.${key}#`;

  return { t: handleTranslate, n: handleTransform };
};
