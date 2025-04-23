'use client';

import type { FC } from 'react';

import { Languages } from 'lucide-react';
import { useCallback } from 'react';

import { language$ } from '@/components/monitor';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableState } from '@/hooks';
import { ELocaleType, LANGUAGE_LIST, setUserLocale, useIntl } from '@/i18n';

export const LanguageToggle: FC = () => {
  const { t } = useIntl('settings.language');

  const language = useObservableState(language$, ELocaleType.EN_US);

  const handleChangeLanguage = useCallback((lang: ELocaleType) => {
    setUserLocale(lang).catch((e: unknown) => {
      console.error(e);
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t(`icon.${language}`)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={language} onValueChange={handleChangeLanguage}>
          {LANGUAGE_LIST.map((lang) => (
            <DropdownMenuRadioItem key={lang} value={lang}>
              {t(`menu.${lang}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
