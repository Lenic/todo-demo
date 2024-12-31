import { ServiceLocator } from '@todo/container';
import { ETheme, IThemeService } from '@todo/controllers';
import { Moon, Sun } from 'lucide-vue-next';
import { defineComponent } from 'vue';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIntl } from '@/i18n';

const themeService = ServiceLocator.default.get(IThemeService);

export const ThemeToggle = defineComponent({
  name: 'ThemeToggle',
  setup() {
    const { t } = useIntl('settings.theme');

    const handleChangeTheme = (e: MouseEvent) => {
      const { theme } = (e.target as HTMLDivElement).dataset;
      if (theme) {
        themeService.setTheme(theme as ETheme);
      }
    };

    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem data-theme={ETheme.LIGHT} onClick={handleChangeTheme}>
            {t('light')}
          </DropdownMenuItem>
          <DropdownMenuItem data-theme={ETheme.DARK} onClick={handleChangeTheme}>
            {t('dark')}
          </DropdownMenuItem>
          <DropdownMenuItem data-theme={ETheme.SYSTEM} onClick={handleChangeTheme}>
            {t('system')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
