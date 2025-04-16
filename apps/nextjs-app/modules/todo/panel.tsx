'use server';

import { ETodoListType } from '@todo/interface';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getIntl } from '@/i18n';

export const TodoPanel = async () => {
  const { t } = await getIntl('todo.panel');

  return (
    <Tabs defaultValue={ETodoListType.PENDING} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value={ETodoListType.PENDING}>{t('pending')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.OVERDUE}>{t('overdue')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.ARCHIVE}>{t('archive')}</TabsTrigger>
      </TabsList>
      <TabsContent value="PENDING" className="pl-2">
        Pending
      </TabsContent>
      <TabsContent value="OVERDUE" className="pl-2">
        Overdue
      </TabsContent>
      <TabsContent value="ARCHIVE" className="pl-2">
        Archive
      </TabsContent>
    </Tabs>
  );
};

// <TodoList type={ETodoListType.PENDING} />
// <TodoList type={ETodoListType.OVERDUE} />
// <TodoList type={ETodoListType.ARCHIVE} />
