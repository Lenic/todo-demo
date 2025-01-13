import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/controllers';
import { EllipsisVertical, Loader2 } from 'lucide-vue-next';
import { concatMap, distinctUntilChanged, filter, map, shareReplay, take } from 'rxjs';
import { defineComponent, ref } from 'vue';

import { Checkbox } from '@/components/ui/checkbox';
import { useLoading, useObservableShallowRef } from '@/hooks';

import { AutoTooltip } from './components/auto-tooltip';
import { RowDatePicker } from './components/row-data-picker';
import { RowDropdownMenu } from './components/row-dropdown-menu';
import { TodoItemEditor } from './editor';

const dataService = ServiceLocator.default.get(IDataService);

export const TodoItem = defineComponent({
  name: 'TodoItem',
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

    const [loadingRef, handleChangeChecked] = useLoading((e: boolean) =>
      item$.pipe(
        take(1),
        concatMap((item) => dataService.update({ ...item, status: e ? ETodoStatus.DONE : ETodoStatus.PENDING })),
      ),
    );

    const openRef = ref(false);
    const handleOpenEditor = () => void (openRef.value = true);
    return () => (
      <div class="flex items-center space-x-2 pr-4 group">
        {loadingRef.value ? (
          <Loader2 class="animate-spin" width={16} height={16} />
        ) : (
          <Checkbox checked={itemRef.value.status === ETodoStatus.DONE} onUpdate:checked={handleChangeChecked} />
        )}
        <AutoTooltip
          id={itemRef.value.id}
          className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
        />
        <div class="flex-auto" />
        <RowDropdownMenu id={itemRef.value.id} onDetail={handleOpenEditor}>
          {(open: boolean) => (
            <EllipsisVertical
              class={[
                'h-4 w-0 group-hover:w-4 group-hover:opacity-100 transition-opacity ease-in-out duration-300',
                { 'opacity-0': !open, '!w-4': open },
              ]}
            />
          )}
        </RowDropdownMenu>
        <RowDatePicker
          className="shrink-0"
          id={itemRef.value.id}
          value={itemRef.value.overdueAt}
          formatString={props.dateFormatString}
          disabled={itemRef.value.status === ETodoStatus.DONE}
        />
        <TodoItemEditor id={props.id} v-model:open={openRef.value} />
      </div>
    );
  },
});
