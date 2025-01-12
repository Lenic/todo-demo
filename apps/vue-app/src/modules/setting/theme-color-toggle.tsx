import type { EThemeColor } from '@todo/controllers';
import type { CSSProperties } from 'vue';

import { ServiceLocator } from '@todo/container';
import { IThemeColorService, THEME_COLOR_LIST } from '@todo/controllers';
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
import { useObservableRef, useObservableShallowRef } from '@/hooks';
import { useIntl } from '@/i18n';

const themeColorService = ServiceLocator.default.get(IThemeColorService);

export const ThemeColorToggle = defineComponent({
  name: 'ThemeColorToggle',
  setup() {
    const { t } = useIntl('settings.theme-color');

    const handleChangeThemeColor = (e: MouseEvent) => {
      const { themeColor } = (e.target as HTMLDivElement).dataset;
      if (themeColor) {
        themeColorService.setThemeColor(themeColor as EThemeColor);
      }
    };

    const iconStyleRef = useObservableShallowRef(
      themeColorService.themeColor$.pipe(map((color) => ({ color: t(`colors.${color}`) }) as CSSProperties)),
      { color: t(`colors.${themeColorService.themeColor}`) } as CSSProperties,
    );
    const themeColorRef = useObservableRef(themeColorService.themeColor$, themeColorService.themeColor);
    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Palette class="h-[1.2rem] w-[1.2rem]" style={iconStyleRef.value} />
            {t(`labels.${themeColorRef.value}`)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {THEME_COLOR_LIST.map((color) => (
            <DropdownMenuItem key={color} data-theme-color={color} onClick={handleChangeThemeColor}>
              <span
                class="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: t(`colors.${color}`) }}
              />
              {t(`labels.${color}`)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
