import { defineComponent } from 'vue';

import { LanguageToggle } from '~/sections/setting/language-toggle';
import { ThemeColorToggle } from '~/sections/setting/theme-color-toggle';
import { UserButton } from '~/sections/setting/user-button';
import { CreateNewTask, TodoPanel } from '~/sections/todo';
import { Toaster } from '~/ui/sonner';

export default defineComponent({
  name: 'Home',
  setup() {
    definePageMeta({ middleware: 'auth' });

    return () => (
      <div class="container fixed inset-0 mx-auto">
        <div class="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
          <LanguageToggle />
          <ThemeColorToggle />
          <UserButton />
        </div>
        <div class="content bg-background md:min-h-64 md:w-[450px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:md:shadow-white/20 max-w-lg max-md:max-w-full p-[0.375rem] rounded-lg md:shadow-2xl max-md:rounded-none">
          <CreateNewTask />
          <TodoPanel />
        </div>
        <Toaster />
      </div>
    );
  },
});
