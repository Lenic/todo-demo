import type { TI18nTranslate } from './types';
import type { Flatten } from '@solid-primitives/i18n';

import { resolveTemplate, scopedTranslator, translator } from '@solid-primitives/i18n';

import { useObservableSignal } from '../hooks';

import { messages$ } from './main';

export const useIntl = (prefix: string) => {
  const messages = useObservableSignal(messages$, {} as Flatten<Record<string, string>>);
  const translate = translator(messages, resolveTemplate);
  const scopedTranslate = scopedTranslator(translate, prefix as keyof typeof messages);

  /**
   * Custom rule of the form error message: It's the i18n key if it starts and ends with the '#' symbol.
   */
  const handleTransform = (key: string) => `#${prefix}.${key}#`;

  return {
    t: scopedTranslate as TI18nTranslate,
    ta: translate as TI18nTranslate,
    n: handleTransform,
  };
};
