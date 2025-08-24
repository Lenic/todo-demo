import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';
import { defineComponent } from 'vue';

import { Toaster } from '~/components/ui/sonner';
import { LanguageToggle } from '~/sections/setting/language-toggle';

import { useIntl } from './i18n';

import 'vue-sonner/style.css';

export default defineComponent({
  name: 'App',
  setup() {
    ServiceLocator.default.get(IThemeService).initialize();
    const { t } = useIntl('todo.panel');

    return () => (
      <div class="container fixed inset-0 mx-auto">
        <div class="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
          <LanguageToggle />
        </div>
        <div class="content bg-background md:min-h-64 md:w-[450px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:md:shadow-white/20 max-w-lg max-md:max-w-full p-[0.375rem] rounded-lg md:shadow-2xl max-md:rounded-none">
          {t('pending')}
        </div>
        <Toaster />
      </div>
    );
  },
});
