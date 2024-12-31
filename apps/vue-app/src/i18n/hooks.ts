import { useI18n } from 'vue-i18n';

export const useIntl = (prefix: string) => {
  const { t } = useI18n();

  const handleTranslate = (key: string) => t(`${prefix}.${key}`);

  return { t: handleTranslate };
};
