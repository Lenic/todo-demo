import type { FC, MouseEventHandler } from 'react';

import { Languages } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableState } from '@/hooks';
import { ELocaleType, LANGUAGE_LIST, language$, setUserLocale, useIntl } from '@/i18n';

export const LanguageToggle: FC = () => {
  const { t } = useIntl('settings.language');

  const language = useObservableState(language$, ELocaleType.EN_US);

  const handleChangeLanguage: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const lang = e.currentTarget.dataset.lang;
    if (!lang) return;

    setUserLocale(lang as ELocaleType).catch((e: unknown) => {
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
        {LANGUAGE_LIST.map((lang) => (
          <DropdownMenuItem key={lang} data-lang={lang} onClick={handleChangeLanguage}>
            {t(`menu.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
