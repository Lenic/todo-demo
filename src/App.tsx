import { Toaster } from '@/components/ui/toaster';
import { ModeToggle, ThemeProvider } from '@/components/theme-provider';

import { TodoPanel, CreateNewTask } from './todo';

export const App = () => {
  return (
    <ThemeProvider>
      <ModeToggle />
      <CreateNewTask />
      <TodoPanel />
      <Toaster />
    </ThemeProvider>
  );
};
