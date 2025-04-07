import type { FC, MouseEventHandler } from 'react';

import { ServiceLocator } from '@todo/container';
import { ETheme, IThemeService } from '@todo/controllers';
import { Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIntl } from '@/i18n';

const themeService = ServiceLocator.default.get(IThemeService);

export const ThemeToggle: FC = () => {
  const { t } = useIntl('settings.theme');

  const handleSwitchTheme: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const theme = e.currentTarget.dataset.theme;
    if (!theme) return;

    themeService.setTheme(theme as ETheme);
  }, []);

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
        <DropdownMenuItem data-theme={ETheme.LIGHT} onClick={handleSwitchTheme}>
          {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem data-theme={ETheme.DARK} onClick={handleSwitchTheme}>
          {t('dark')}
        </DropdownMenuItem>
        <DropdownMenuItem data-theme={ETheme.SYSTEM} onClick={handleSwitchTheme}>
          {t('system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
