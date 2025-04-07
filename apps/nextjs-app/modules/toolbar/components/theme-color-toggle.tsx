import type { EThemeColor } from '@todo/controllers';
import type { FC, MouseEventHandler } from 'react';

import { ServiceLocator } from '@todo/container';
import { IThemeService, THEME_COLOR_LIST } from '@todo/controllers';
import { Palette } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { map } from 'rxjs';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableState } from '@/hooks';
import { language$, useIntl } from '@/i18n';

const themeService = ServiceLocator.default.get(IThemeService);

export const ThemeColorToggle: FC = () => {
  const { t } = useIntl('settings.theme-color');

  const handleChangeThemeColor: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const { themeColor } = e.currentTarget.dataset;
    if (themeColor) {
      themeService.setColor(themeColor as EThemeColor);
    }
  }, []);

  const colorList = useObservableState(
    useMemo(
      () =>
        language$.pipe(
          map(() =>
            THEME_COLOR_LIST.map((color) => (
              <DropdownMenuItem key={color} data-theme-color={color} onClick={handleChangeThemeColor}>
                <span
                  className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mr-2"
                  style={{ backgroundColor: t(`colors.${color}`) }}
                />
                {t(`labels.${color}`)}
              </DropdownMenuItem>
            )),
          ),
        ),
      [handleChangeThemeColor, t],
    ),
    null,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem] text-primary" />
          <span className="sr-only">{t(`labels.${themeService.color}`)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{colorList}</DropdownMenuContent>
    </DropdownMenu>
  );
};
