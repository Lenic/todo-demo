'use server';

import { ServiceLocator } from '@todo/container';
import { ETodoListType } from '@todo/interface';
import { firstValueFrom } from 'rxjs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getIntl } from '@/i18n';
import { IDBDataStorageService } from '@/services/api';

import { TodoList } from './list';

export const TodoPanel = async () => {
  const { t } = await getIntl('todo.panel');
  const dataSource = await firstValueFrom(
    ServiceLocator.default.get(IDBDataStorageService).query({ limit: 10, offset: 0, type: ETodoListType.PENDING }),
  );

  return (
    <Tabs defaultValue={ETodoListType.PENDING} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value={ETodoListType.PENDING}>{t('pending')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.OVERDUE}>{t('overdue')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.ARCHIVE}>{t('archive')}</TabsTrigger>
      </TabsList>
      <TabsContent value="PENDING" className="pl-2">
        <TodoList type={ETodoListType.PENDING} data={dataSource} />
      </TabsContent>
      <TabsContent value="OVERDUE" className="pl-2">
        <TodoList type={ETodoListType.OVERDUE} />
      </TabsContent>
      <TabsContent value="ARCHIVE" className="pl-2">
        <TodoList type={ETodoListType.ARCHIVE} />
      </TabsContent>
    </Tabs>
  );
};
