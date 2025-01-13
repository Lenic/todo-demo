import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useIntl = (prefix: string) => {
  const { t, i18n } = useTranslation();

  const handleTranslate = useCallback(
    (key: string, literal: Record<string, unknown> = {}) => t(`${prefix}.${key}`, literal),
    [prefix, t],
  );

  return { t: handleTranslate, i18n };
};
