import { Toaster } from '@/components/ui/toaster';
import { LanguageToggle } from '@/modules/setting/language-toggle';
import { ModeToggle, ThemeProvider } from '@/modules/setting/theme-provider';

import { CreateNewTask, TodoPanel } from './modules/todo';

const App = () => {
  return (
    <ThemeProvider>
      <div className="container fixed inset-0 mx-auto">
        <div className="header flex justify-end pt-4 px-4 space-x-2 max-md:justify-center max-md:bg-background">
          <LanguageToggle />
          <ModeToggle />
        </div>
        <div className="content bg-background md:min-h-64 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:md:shadow-white/20 max-w-lg p-[0.375rem] rounded-lg md:shadow-2xl max-md:rounded-none">
          <CreateNewTask />
          <TodoPanel />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
