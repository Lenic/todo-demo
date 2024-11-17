import type { FC } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntl } from '@/i18n';
import { ETodoListType } from '@todo/controllers';

import { TodoList } from './list';

export const TodoPanel: FC = () => {
  const { t } = useIntl('todo.panel');

  return (
    <Tabs defaultValue={ETodoListType.PENDING} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value={ETodoListType.PENDING}>{t('pending')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.OVERDUE}>{t('overdue')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.ARCHIVE}>{t('archive')}</TabsTrigger>
      </TabsList>
      <TabsContent value="PENDING" className="pl-2">
        <TodoList type={ETodoListType.PENDING} />
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
