import { ServiceLocator } from '@todo/container';
import { IThemeService, THEME_COLOR_LIST } from '@todo/controllers';
import { Palette } from 'lucide-solid';
import { Index } from 'solid-js';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIntl } from '@/i18n';

const themeService = ServiceLocator.default.get(IThemeService);

export const ThemeColorToggle = () => {
  const { t } = useIntl('settings.theme-color');

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon">
          <Palette class="h-[1.2rem] w-[1.2rem]" style={{ color: 'hsl(var(--primary))' }} />
          <span class="sr-only">{t(`labels.${themeService.color}`)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Index each={THEME_COLOR_LIST}>
          {(color) => (
            <DropdownMenuItem onClick={[themeService.setColor, color()]}>
              <span
                class="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mr-2"
                style={{ 'background-color': t(`colors.${color()}`) }}
              />
              {t(`labels.${color()}`)}
            </DropdownMenuItem>
          )}
        </Index>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
