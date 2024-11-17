import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useIntl = (prefix: string) => {
  const { t, i18n } = useTranslation();

  const handleTranslate = useCallback((key: string) => t(`${prefix}.${key}`), [prefix, t]);

  return { t: handleTranslate, i18n };
};
