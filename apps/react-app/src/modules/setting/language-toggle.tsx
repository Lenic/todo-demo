import type { FC } from 'react';

import i18n from 'i18next';
import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGE_LIST, useIntl } from '@/i18n';

export const LanguageToggle: FC = () => {
  const { t } = useIntl('settings.language');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t(`icon.${i18n.language}`)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_LIST.map((lang) => (
          <DropdownMenuItem key={lang} onClick={() => void i18n.changeLanguage(lang)}>
            {t(`menu.${lang}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
