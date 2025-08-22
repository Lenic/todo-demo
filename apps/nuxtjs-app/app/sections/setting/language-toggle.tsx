import { Languages } from 'lucide-vue-next';
import { defineComponent } from 'vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGE_LIST, useIntl, ELocaleType, COOKIE_NAME, loadI18nMessages } from '@/i18n';

export const LanguageToggle = defineComponent({
  name: 'LanguageToggle',
  setup() {
    const { t, locale, setLocaleMessage } = useIntl('settings.language');

    const handleChangeLanguage = async (e: MouseEvent) => {
      const { lang } = (e.target as HTMLDivElement).dataset;
      if (lang) {
        const messages = await loadI18nMessages(lang as ELocaleType);
        setLocaleMessage(locale.value, messages);

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
