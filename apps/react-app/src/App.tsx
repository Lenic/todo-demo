import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';
import { useEffect } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { LanguageToggle } from '@/modules/setting/language-toggle';
import { ThemeColorToggle } from '@/modules/setting/theme-color-toggle';
import { ThemeToggle } from '@/modules/setting/theme-toggle';
import { CreateNewTask, TodoPanel } from '@/modules/todo';

const App = () => {
  useEffect(() => {
    ServiceLocator.default.get(IThemeService).initialize();
  }, []);

  return (
    <div className="container fixed inset-0 mx-auto">
      <div className="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
        <LanguageToggle />
        <ThemeToggle />
        <ThemeColorToggle />
      </div>
      <div className="content bg-background md:min-h-64 md:w-[450px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:md:shadow-white/20 max-w-lg max-md:max-w-full p-1.5 rounded-lg md:shadow-2xl max-md:rounded-none">
        <CreateNewTask />
        <TodoPanel />
      </div>
      <Toaster />
    </div>
  );
};

export default App;
