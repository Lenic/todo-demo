import type { FC } from 'react';

import { useCallback, useState } from 'react';

import { ETodoListType } from '@/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useObservableState } from '@/hooks';
import { ServiceLocator } from '@/lib/injector';

import { IDataService } from '../resources';

import { TodoList } from './list';

const dataService = ServiceLocator.default.get(IDataService);

export const TodoPanel: FC = () => {
  const pendingList = useObservableState(dataService.planningList$, []);
  const overdueList = useObservableState(dataService.overdueList$, []);
  const archiveList = useObservableState(dataService.archiveList$, []);

  const [activeTab, setActiveTab] = useState<ETodoListType>(ETodoListType.PENDING);
  const handleChangeActiveTab = useCallback((value: string) => setActiveTab(value as ETodoListType), []);

  return (
    <Tabs value={activeTab} onValueChange={handleChangeActiveTab} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="PENDING">Pending</TabsTrigger>
        <TabsTrigger value="OVERDUE">Overdue</TabsTrigger>
        <TabsTrigger value="ARCHIVE">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="PENDING" className="pl-2">
        <TodoList ids={pendingList} type={ETodoListType.PENDING} />
      </TabsContent>
      <TabsContent value="OVERDUE" className="pl-2">
        <TodoList ids={overdueList} type={ETodoListType.OVERDUE} />
      </TabsContent>
      <TabsContent value="ARCHIVE" className="pl-2">
        <TodoList ids={archiveList} type={ETodoListType.ARCHIVE} />
      </TabsContent>
    </Tabs>
  );
};
