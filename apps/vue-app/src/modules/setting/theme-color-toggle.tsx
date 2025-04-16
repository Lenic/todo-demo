import type { EThemeColor } from '@todo/interface';

import { ServiceLocator } from '@todo/container';
import { IThemeService, THEME_COLOR_LIST } from '@todo/interface';
import { Palette } from 'lucide-vue-next';
import { map } from 'rxjs';
import { defineComponent } from 'vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableShallowRef } from '@/hooks';
import { language$, useIntl } from '@/i18n';

const themeService = ServiceLocator.default.get(IThemeService);

export const ThemeColorToggle = defineComponent({
  name: 'ThemeColorToggle',
  setup() {
    const { t } = useIntl('settings.theme-color');

    const handleChangeThemeColor = (e: MouseEvent) => {
      const { themeColor } = (e.target as HTMLDivElement).dataset;
      if (themeColor) {
        themeService.setColor(themeColor as EThemeColor);
      }
    };

    const colorListRef = useObservableShallowRef(
      language$.pipe(
        map(() =>
          THEME_COLOR_LIST.map((color) => (
            <DropdownMenuItem key={color} data-theme-color={color} onClick={handleChangeThemeColor}>
              <span
                class="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: t(`colors.${color}`) }}
              />
              {t(`labels.${color}`)}
            </DropdownMenuItem>
          )),
        ),
      ),
    );

    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Palette class="h-[1.2rem] w-[1.2rem] text-primary" />
            <span class="sr-only">{t(`labels.${themeService.color}`)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{colorListRef.value}</DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
