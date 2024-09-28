import type { FC } from 'react';

import { useMemo } from 'react';
import { ServiceLocator } from '@/lib/injector';
import { useObservableState } from '@/hooks';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { IDataService } from '../resources';

import { TodoList } from './list';

export const TodoPanel: FC = () => {
  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);

  const pendingList = useObservableState(dataService.planningList$, []);
  const overdueList = useObservableState(dataService.overdueList$, []);
  const archiveList = useObservableState(dataService.archiveList$, []);

  return (
    <Tabs defaultValue="pending" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="overdue">Overdue</TabsTrigger>
        <TabsTrigger value="archive">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        <TodoList ids={pendingList} />
      </TabsContent>
      <TabsContent value="overdue">
        <TodoList ids={overdueList} />
      </TabsContent>
      <TabsContent value="archive">
        <TodoList ids={archiveList} />
      </TabsContent>
    </Tabs>
  );
};
