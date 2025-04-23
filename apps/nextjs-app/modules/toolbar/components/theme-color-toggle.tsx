'use client';

import type { FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { IThemeService, THEME_COLOR_LIST } from '@todo/interface';
import { Palette } from 'lucide-react';
import { useMemo, useState } from 'react';
import { map } from 'rxjs';

import { language$ } from '@/components/monitor';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableState } from '@/hooks';
import { useIntl } from '@/i18n';

export const ThemeColorToggle: FC = () => {
  const { t } = useIntl('settings.theme-color');
  const [themeService] = useState(() => ServiceLocator.default.get(IThemeService));

  const color = useObservableState(themeService.color$, themeService.color);

  const colorList = useObservableState(
    useMemo(
      () =>
        language$.pipe(
          map(() =>
            THEME_COLOR_LIST.map((color) => (
              <DropdownMenuRadioItem key={color} value={color}>
                <span
                  className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mr-2"
                  style={{ backgroundColor: t(`colors.${color}`) }}
                />
                {t(`labels.${color}`)}
              </DropdownMenuRadioItem>
            )),
          ),
        ),
      [t],
    ),
    null,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem] text-primary" />
          <span className="sr-only">Switch Theme Color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={color} onValueChange={themeService.setColor}>
          {colorList}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
