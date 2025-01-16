import { ETodoListType } from '@todo/controllers';

import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntl } from '@/i18n';

// import { TodoList } from './list';

export const TodoPanel = () => {
  const { t } = useIntl('todo.panel');

  return (
    <Tabs defaultValue={ETodoListType.PENDING} class="w-full">
      <TabsList class="w-full grid grid-cols-3">
        <TabsTrigger value={ETodoListType.PENDING}>{t('pending')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.OVERDUE}>{t('overdue')}</TabsTrigger>
        <TabsTrigger value={ETodoListType.ARCHIVE}>{t('archive')}</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="PENDING" class="pl-2">
        <div>PENDING</div>
      </TabsContent>
      <TabsContent value="OVERDUE" class="pl-2">
        <div>OVERDUE</div>
      </TabsContent>
      <TabsContent value="ARCHIVE" class="pl-2">
        <div>ARCHIVE</div>
      </TabsContent>
    </Tabs>
  );
};

// <TodoList type={ETodoListType.PENDING} />
