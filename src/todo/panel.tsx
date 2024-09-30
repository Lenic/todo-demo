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
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="overdue">Overdue</TabsTrigger>
        <TabsTrigger value="archive">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="pending" className="px-2">
        <TodoList ids={pendingList} />
      </TabsContent>
      <TabsContent value="overdue" className="px-2">
        <TodoList ids={overdueList} />
      </TabsContent>
      <TabsContent value="archive" className="px-2">
        <TodoList ids={archiveList} />
      </TabsContent>
    </Tabs>
  );
};
