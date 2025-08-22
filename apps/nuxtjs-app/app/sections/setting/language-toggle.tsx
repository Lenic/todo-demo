import { Languages } from 'lucide-vue-next';
import { defineComponent } from 'vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGE_LIST, useIntl, getI18nInstance, ELocaleType, COOKIE_NAME } from '@/i18n';

export const LanguageToggle = defineComponent({
  name: 'LanguageToggle',
  setup() {
    const { t, locale } = useIntl('settings.language');

    const handleChangeLanguage = async (e: MouseEvent) => {
      const { lang } = (e.target as HTMLDivElement).dataset;
      if (lang) {
        await getI18nInstance(lang as ELocaleType);

        document.cookie = `${COOKIE_NAME}=${lang}; Path=/; Secure; SameSite=Lax`;
      }
    };

    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Languages class="h-[1.2rem] w-[1.2rem]" />
            <span class="sr-only">{t(`icon.${locale.value}`)}</span>
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
