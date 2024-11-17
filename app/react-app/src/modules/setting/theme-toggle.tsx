import type { FC } from 'react';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIntl } from '@/i18n';
import { ServiceLocator } from '@todo/container';
import { ETheme, IThemeService } from '@todo/controllers';

const themeService = ServiceLocator.default.get(IThemeService);

export const ThemeToggle: FC = () => {
  const { t } = useIntl('settings.theme');

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
        <DropdownMenuItem
          onClick={() => {
            themeService.setTheme(ETheme.LIGHT);
          }}
        >
          {t('light')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            themeService.setTheme(ETheme.DARK);
          }}
        >
          {t('dark')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            themeService.setTheme(ETheme.SYSTEM);
          }}
        >
          {t('system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
