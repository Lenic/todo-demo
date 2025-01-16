import type { ELocaleType } from '@/i18n';

import { Languages } from 'lucide-vue-next';
import { defineComponent } from 'vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableRef } from '@/hooks';
import { LANGUAGE_LIST, language$, localeTrigger, useIntl } from '@/i18n';

export const LanguageToggle = defineComponent({
  name: 'LanguageToggle',
  setup() {
    const { t } = useIntl('settings.language');

    const handleChangeLanguage = (e: MouseEvent) => {
      const { lang } = (e.target as HTMLDivElement).dataset;
      if (lang) {
        localeTrigger.next(lang as ELocaleType);
      }
    };

    const languageRef = useObservableRef(language$, '');
    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Languages class="h-[1.2rem] w-[1.2rem]" />
            <span class="sr-only">{t(`icon.${languageRef.value}`)}</span>
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
  },
});
