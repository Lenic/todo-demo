import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { ServiceLocator } from '@/lib/injector';
import { ModeToggle, ThemeProvider } from '@/components/theme-provider';

import { IDataService, ETodoStatus } from './resources';
import { TodoPanel, CreateNewTask } from './todo';

const tomorrowBeginTimeValue = dayjs().add(1, 'day').startOf('day').valueOf();

export const App = () => {
  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);

  const handleAppend1 = useCallback(() => {
    dataService.append([
      { id: '1', createdAt: 1, status: ETodoStatus.PENDING, title: '1', updatedAt: 1 },
      { id: '2', createdAt: 2, status: ETodoStatus.PENDING, title: '2', updatedAt: 2 },
    ]);
  }, [dataService]);

  const handleAppend2 = useCallback(() => {
    dataService.append([
      {
        id: '11',
        createdAt: 1,
        status: ETodoStatus.PENDING,
        title: '11',
        updatedAt: 2,
        overdueAt: tomorrowBeginTimeValue + 10,
      },
      {
        id: '21',
        createdAt: 2,
        status: ETodoStatus.PENDING,
        title: '21',
        updatedAt: 6,
        overdueAt: tomorrowBeginTimeValue + 20,
      },
    ]);
  }, [dataService]);

  const handleAppend3 = useCallback(() => {
    dataService.append([
      {
        id: '31',
        createdAt: 8,
        status: ETodoStatus.DONE,
        title: '31',
        updatedAt: 10,
        overdueAt: tomorrowBeginTimeValue + 10,
      },
      {
        id: '32',
        createdAt: 3,
        status: ETodoStatus.DONE,
        title: '32',
        updatedAt: 4,
        overdueAt: tomorrowBeginTimeValue + 20,
      },
    ]);
  }, [dataService]);

  return (
    <ThemeProvider>
      <ModeToggle />
      <Button variant="outline" onClick={handleAppend1}>
        add 2 pending items
      </Button>
      <Button variant="outline" onClick={handleAppend2}>
        add 2 overdue items
      </Button>
      <Button variant="outline" onClick={handleAppend3}>
        add 2 archive items
      </Button>
      <TodoPanel />
      <CreateNewTask />
      <Toaster />
    </ThemeProvider>
  );
};
