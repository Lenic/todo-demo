import { ETodoListType } from '@todo/controllers';
import { defineComponent } from 'vue';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntl } from '@/i18n';

// import { TodoList } from './list';
// <TodoList type={ETodoListType.PENDING} />
// <TodoList type={ETodoListType.OVERDUE} />
// <TodoList type={ETodoListType.ARCHIVE} />

export const TodoPanel = defineComponent({
  name: 'TodoPanel',
  setup() {
    const { t } = useIntl('todo.panel');

    return () => (
      <Tabs defaultValue={ETodoListType.PENDING} class="w-full">
        <TabsList class="w-full grid grid-cols-3">
          <TabsTrigger value={ETodoListType.PENDING}>{t('pending')}</TabsTrigger>
          <TabsTrigger value={ETodoListType.OVERDUE}>{t('overdue')}</TabsTrigger>
          <TabsTrigger value={ETodoListType.ARCHIVE}>{t('archive')}</TabsTrigger>
        </TabsList>
        <TabsContent value="PENDING" class="pl-2">
          <div>pending</div>
        </TabsContent>
        <TabsContent value="OVERDUE" class="pl-2">
          <div>overdue</div>
        </TabsContent>
        <TabsContent value="ARCHIVE" class="pl-2">
          <div>archive</div>
        </TabsContent>
      </Tabs>
    );
  },
});
