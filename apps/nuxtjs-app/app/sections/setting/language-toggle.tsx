import { Languages, LoaderPinwheel } from 'lucide-vue-next';
import { defineComponent } from 'vue';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useAsyncEvent } from '~/hooks';
import { COOKIE_NAME, ELocaleType, LANGUAGE_LIST, loadI18nMessages, useIntl } from '~/i18n';

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
        const lang = context.lang as ELocaleType | undefined;
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
          <DropdownMenuRadioGroup modelValue={locale.value}>
            {LANGUAGE_LIST.map((lang) => (
              <DropdownMenuRadioItem
                key={lang}
                value={lang}
                data-lang={lang}
                disabled={pendingRef.value || locale.value === (lang as string)}
                onSelect={handleChangeLanguage}
              >
                {t(`menu.${lang}`)}
                {detailPendingRef.value[lang] ? <LoaderPinwheel class="animate-spin duration-500" /> : null}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
