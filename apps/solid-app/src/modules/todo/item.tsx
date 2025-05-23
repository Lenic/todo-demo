import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/interface';
import { EllipsisVertical, Loader2 } from 'lucide-solid';
import { concatMap, distinctUntilChanged, filter, map, shareReplay, take } from 'rxjs';
import { createSignal } from 'solid-js';

import { Checkbox, CheckboxControl } from '@/components/ui/checkbox';
import { useLoading, useObservableSignal } from '@/hooks';

import { AutoTooltip } from './components/auto-tooltip';
import { RowDatePicker } from './components/row-date-picker';
import { RowDropdownMenu } from './components/row-dropdown-menu';
import { TodoItemEditor } from './editor';

const dataService = ServiceLocator.default.get(IDataService);

export interface TodoItemProps {
  id: string;
  dateFormatString: string;
}

export const TodoItem = (props: TodoItemProps) => {
  const item$ = dataService.dataMapper$.pipe(
    map((mapper) => mapper[props.id]),
    distinctUntilChanged(),
    filter((v) => !!v),
    shareReplay(1),
  );
  const item = useObservableSignal(item$, dataService.dataMapper[props.id]);

  const [loading, handleChangeChecked] = useLoading((checked: boolean) =>
    item$.pipe(
      take(1),
      concatMap((item) => dataService.update({ ...item, status: checked ? ETodoStatus.DONE : ETodoStatus.PENDING })),
    ),
  );

  const [editorVisible, setEditorVisible] = createSignal(false);
  return (
    <div class="h-10 flex flex-row items-center space-x-2 pr-4 group">
      {loading() ? (
        <Loader2 class="animate-spin w-4 h-4 flex-none" width={16} height={16} />
      ) : (
        <Checkbox checked={item().status === ETodoStatus.DONE} onChange={handleChangeChecked}>
          <CheckboxControl />
        </Checkbox>
      )}
      <AutoTooltip id={props.id} className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate" />
      <div class="flex-auto" />
      <RowDropdownMenu id={item().id} onDetail={() => setEditorVisible(true)}>
        {(open: boolean) => (
          <EllipsisVertical
            class="h-4 w-0 group-hover:w-4 group-hover:opacity-100 transition-opacity ease-in-out duration-300"
            classList={{ 'opacity-0': !open, '!w-4': open }}
          />
        )}
      </RowDropdownMenu>
      <RowDatePicker
        className="shrink-0"
        id={item().id}
        value={item().overdueAt}
        formatString={props.dateFormatString}
        disabled={item().status === ETodoStatus.DONE}
      />
      <TodoItemEditor id={props.id} open={editorVisible()} onOpenChange={setEditorVisible} />
    </div>
  );
};
