import type { FC } from 'react';

import i18n from 'i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGE_LIST } from '@/i18n';
import { useIntl } from '@/i18n';

export const LanguageToggle: FC = () => {
  const { t } = useIntl('settings.language');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {t(`icon.${i18n.language}`)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_LIST.map((lang) => (
          <DropdownMenuItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
            {t(`menu.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
