import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/controllers';

import { useIntl } from '@/i18n';
import { LanguageToggle } from '@/modules/setting/language-toggle';
import { ThemeColorToggle } from '@/modules/setting/theme-color-toggle';
import { ThemeToggle } from '@/modules/setting/theme-toggle';

const App = () => {
  ServiceLocator.default.get(IThemeService).initialize();
  const { t } = useIntl('todo.item-dropdown-menu.remove-dialog');

  return (
    <div class="container fixed inset-0 mx-auto">
      <div class="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
        <LanguageToggle />
        <ThemeToggle />
        <ThemeColorToggle />
      </div>
      <div class="content bg-background md:min-h-64 md:w-[450px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:md:shadow-white/20 max-w-lg max-md:max-w-full p-[0.375rem] rounded-lg md:shadow-2xl max-md:rounded-none">
        <div>{t('description', { val: 'abc' })}</div>
      </div>
    </div>
  );
};

export default App;
