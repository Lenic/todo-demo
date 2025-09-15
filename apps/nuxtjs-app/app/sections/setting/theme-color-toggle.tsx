import type { EThemeColor } from '@todo/interface';

import { ServiceLocator } from '@todo/container';
import { IThemeService, THEME_COLOR_LIST } from '@todo/interface';
import { Palette } from 'lucide-vue-next';
import { defineComponent } from 'vue';

import { useIntl } from '@/i18n';
import { useObservableRef } from '~/hooks';
import { Button } from '~/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu';

export const ThemeColorToggle = defineComponent({
  name: 'ThemeColorToggle',
  setup() {
    const themeService = ServiceLocator.default.get(IThemeService);

    const handleChangeThemeColor = (e: MouseEvent) => {
      const { themeColor } = (e.target as HTMLDivElement).dataset;
      if (themeColor) {
        themeService.setColor(themeColor as EThemeColor);
      }
    };

    const { t } = useIntl('settings.theme-color');
    const themeColorRef = useObservableRef(themeService.color$, themeService.color);
    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Palette class="h-[1.2rem] w-[1.2rem] text-primary" />
            <span class="sr-only">{t(`labels.${themeColorRef.value}`)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup modelValue={themeColorRef.value}>
            {THEME_COLOR_LIST.map((color) => (
              <DropdownMenuRadioItem
                key={color}
                value={color}
                data-theme-color={color}
                onClick={handleChangeThemeColor}
              >
                <span
                  class="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: t(`colors.${color}`) }}
                />
                {t(`labels.${color}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
