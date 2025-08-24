import { Languages } from 'lucide-vue-next';
import { defineComponent } from 'vue';
import { LoaderPinwheel } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LANGUAGE_LIST, useIntl, ELocaleType, COOKIE_NAME, loadI18nMessages } from '@/i18n';
import { useAsyncEvent } from '~/hooks';

export const LanguageToggle = defineComponent({
  name: 'LanguageToggle',
  setup() {
    const { t, locale, setLocaleMessage } = useIntl('settings.language');

    const detailPendingRef = ref({
      [ELocaleType.EN_US]: false,
      [ELocaleType.JA_JP]: false,
      [ELocaleType.ZH_CN]: false,
    });

    const [handleChangeLanguage, pendingRef] = useAsyncEvent(
      async (e: CustomEvent, context) => {
        e.preventDefault();

        const { lang } = (document.activeElement as HTMLDivElement).dataset;
        if (lang) {
          context.lang = lang;

          const messages = await loadI18nMessages(lang as ELocaleType);
          locale.value = lang;
          setLocaleMessage(locale.value, messages);

          document.cookie = `${COOKIE_NAME}=${lang}; Path=/; Secure; SameSite=Lax`;
        }
      },
      (processing, context) => {
        const lang = context.lang as ELocaleType;
        if (lang) {
          detailPendingRef.value[lang] = processing;
        }
      },
    );

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
            <DropdownMenuItem
              key={lang}
              data-lang={lang}
              disabled={pendingRef.value || locale.value === lang}
              onSelect={handleChangeLanguage}
            >
              {t(`menu.${lang}`)}
              {detailPendingRef.value[lang] ? <LoaderPinwheel class="animate-spin duration-500" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
