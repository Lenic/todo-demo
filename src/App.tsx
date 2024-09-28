import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { ServiceLocator } from '@/lib/injector';
import { useObservableState } from '@/hooks';
import { ThemeProvider } from '@/components/theme-provider';

import { IDataService, ETodoStatus } from './resources';

const tomorrowBeginTimeValue = dayjs().add(1, 'day').startOf('day').valueOf();

export const App = () => {
  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);

  const [pendingList] = useObservableState(dataService.planningList$, []);
  const [overdueList] = useObservableState(dataService.overdueList$, []);
  const [archiveList] = useObservableState(dataService.archiveList$, []);

  const handleAppend1 = useCallback(() => {
    dataService.append([
      { id: '1', createdAt: 1, status: ETodoStatus.PENDING, title: '111', updatedAt: 1 },
      { id: '2', createdAt: 2, status: ETodoStatus.PENDING, title: '222', updatedAt: 2 },
    ]);
  }, [dataService]);

  const handleAppend2 = useCallback(() => {
    dataService.append([
      {
        id: '11',
        createdAt: 1,
        status: ETodoStatus.PENDING,
        title: '111',
        updatedAt: 1,
        overdueAt: tomorrowBeginTimeValue + 10,
      },
      {
        id: '21',
        createdAt: 2,
        status: ETodoStatus.PENDING,
        title: '222',
        updatedAt: 2,
        overdueAt: tomorrowBeginTimeValue + 20,
      },
    ]);
  }, [dataService]);

  const handleAppend3 = useCallback(() => {
    dataService.append([
      {
        id: '31',
        createdAt: 1,
        status: ETodoStatus.DONE,
        title: '111',
        updatedAt: 10,
        overdueAt: tomorrowBeginTimeValue + 10,
      },
      {
        id: '32',
        createdAt: 2,
        status: ETodoStatus.DONE,
        title: '222',
        updatedAt: 2,
        overdueAt: tomorrowBeginTimeValue + 20,
      },
    ]);
  }, [dataService]);

  return (
    <ThemeProvider>
      <Button variant="outline" onClick={handleAppend1}>
        add 2 pending items
      </Button>
      <Button variant="outline" onClick={handleAppend2}>
        add 2 overdue items
      </Button>
      <Button variant="outline" onClick={handleAppend3}>
        add 2 archive items
      </Button>
      <div>pendingList: {pendingList.join(',')}</div>
      <div>overdueList: {overdueList.join(',')}</div>
      <div>archiveList: {archiveList.join(',')}</div>
    </ThemeProvider>
  );
};
