import { ModeToggle, ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import { CreateNewTask, TodoPanel } from './modules/todo';

const App = () => {
  return (
    <ThemeProvider>
      <div className="container fixed inset-0 mx-auto">
        <div className="header pt-4 px-4 text-right max-md:text-center">
          <ModeToggle />
        </div>
        <div className="content md:min-h-64 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:md:shadow-white/60 max-w-lg p-[0.375rem] rounded-lg md:shadow-2xl">
          <CreateNewTask />
          <TodoPanel />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
