'use client';

import { ServiceLocator } from '@todo/container';
import { ETheme, IThemeService } from '@todo/interface';
import { Moon, Sun } from 'lucide-react';
import { type FC, useCallback, useState } from 'react';

import { setTheme } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useObservableEffect, useObservableState } from '@/hooks';
import { useIntl } from '@/i18n';

export const ThemeToggle: FC = () => {
  const { t } = useIntl('settings.theme');
  const [themeService] = useState(() => ServiceLocator.default.get(IThemeService));

  const theme = useObservableState(themeService.theme$, themeService.theme);

  useObservableEffect(
    themeService.theme$,
    useCallback((theme: ETheme) => {
      setTheme(theme).catch(() => {
        // TODO: i18n.
        console.error('set theme error');
      });
    }, []),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={themeService.setTheme}>
          <DropdownMenuRadioItem value={ETheme.LIGHT}>{t('light')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={ETheme.DARK}>{t('dark')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={ETheme.SYSTEM}>{t('system')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
