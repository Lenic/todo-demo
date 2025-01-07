import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/controllers';
import { Loader2 } from 'lucide-vue-next';
import { concatMap, distinctUntilChanged, filter, map, shareReplay, take } from 'rxjs/operators';
import { defineComponent, watch } from 'vue';

import { Checkbox } from '@/components/ui/checkbox';
import { useLoading, useObservableShallowRef } from '@/hooks';

// import { AutoTooltip } from './components/auto-tooltip';
// import { RowContextMenu } from './components/row-context-menu';
// import { RowDatePicker } from './components/row-data-picker';
// import { TodoItemEditor } from './editor';

const dataService = ServiceLocator.default.get(IDataService);

export const TodoItem = defineComponent({
  name: 'TodoItemCore',
  props: {
    id: { type: String, required: true },
    dateFormatString: { type: String, required: true },
  },
  setup(props) {
    const item$ = dataService.dataMapper$.pipe(
      map((mapper) => mapper[props.id]),
      distinctUntilChanged(),
      filter((v) => !!v),
      shareReplay(1),
    );
    const itemRef = useObservableShallowRef(item$, dataService.dataMapper[props.id]);

    if (props.id === 'fh8qJcsupSqzgr5Tx-Ji6') {
      watch(
        () => props.id,
        (id) => {
          console.log('item id', id);
        },
        { immediate: true },
      );
    }

    const [loadingRef, handleChangeChecked] = useLoading((e: boolean) =>
      item$.pipe(
        take(1),
        concatMap((item) => dataService.update({ ...item, status: e ? ETodoStatus.DONE : ETodoStatus.PENDING })),
      ),
    );

    // const overdueAt = computed(() => (item.overdueAt ? new Date(item.overdueAt) : undefined), [item.overdueAt]);
    return () => (
      <div class="flex items-center space-x-2 pr-4">
        {loadingRef.value ? (
          <Loader2 class="animate-spin" width={16} height={16} />
        ) : (
          <Checkbox checked={itemRef.value.status === ETodoStatus.DONE} onUpdate:checked={handleChangeChecked} />
        )}
        <div>{itemRef.value.title}</div>
        <div class="flex-auto" />
      </div>
    );
  },
});
