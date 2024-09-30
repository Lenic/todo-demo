import { Toaster } from '@/components/ui/toaster';
import { ModeToggle, ThemeProvider } from '@/components/theme-provider';

import { TodoPanel, CreateNewTask } from './todo';

export const App = () => {
  return (
    <ThemeProvider>
      <div className="container mx-auto">
        <div className="header pt-4 pr-4 text-right">
          <ModeToggle />
        </div>
        <div className="content min-h-64 dark:shadow-white/20 mt-10 text-center max-w-lg mx-auto p-[0.375rem] rounded-md shadow-xl">
          <CreateNewTask />
          <TodoPanel />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};
