import type { FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { ETheme, IThemeService } from '@todo/controllers';
import { Moon, Sun } from 'lucide-react';

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

const themeService = ServiceLocator.default.get(IThemeService);

export const ThemeToggle: FC = () => {
  const { t } = useIntl('settings.theme');

  const theme = useObservableState(themeService.theme$, themeService.theme);

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
