'use server';

import { CreateNewTask } from '@/modules/todo';
import { Toolbar } from '@/modules/toolbar';

// eslint-disable-next-line @typescript-eslint/require-await -- this is the page component, must be async component.
export default async function App() {
  return (
    <div className="@container fixed inset-0 mx-auto">
      <Toolbar />
      <div className="content bg-background md:min-h-64 md:w-[450px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 dark:md:shadow-white/20 max-w-lg max-md:max-w-full p-[0.375rem] rounded-lg md:shadow-2xl max-md:rounded-none">
        <CreateNewTask />
      </div>
    </div>
  );
}
