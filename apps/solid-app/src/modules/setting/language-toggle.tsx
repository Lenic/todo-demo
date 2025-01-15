import type { ELocaleType } from '@/i18n';

import { Languages } from 'lucide-solid';
import { Index } from 'solid-js';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableSignal } from '@/hooks';
import { language$, localeTrigger } from '@/i18n';
import { LANGUAGE_LIST, useIntl } from '@/i18n';

export const LanguageToggle = () => {
  const { t } = useIntl('settings.language');

  const handleChangeLanguage = (e: MouseEvent) => {
    const { lang } = (e.target as HTMLDivElement).dataset;
    if (lang) {
      localeTrigger.next(lang as ELocaleType);
    }
  };

  const language = useObservableSignal(language$, localeTrigger.getValue());
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon">
          <Languages class="h-[1.2rem] w-[1.2rem]" />
          <span class="sr-only">{t(`icon.${language()}`)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Index each={LANGUAGE_LIST}>
          {(lang) => (
            <DropdownMenuItem data-lang={lang()} onClick={handleChangeLanguage}>
              {t(`menu.${lang()}`)}
            </DropdownMenuItem>
          )}
        </Index>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
