import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { Loader2 } from 'lucide-solid';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs';

import { useObservableSignal } from '@/hooks';

// import { Checkbox } from '@/components/ui/checkbox';
// import { useLoading, useObservableShallowRef } from '@/hooks';
import { AutoTooltip } from './components/auto-tooltip';
// import { RowDatePicker } from './components/row-data-picker';
// import { RowDropdownMenu } from './components/row-dropdown-menu';
// import { TodoItemEditor } from './editor';

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

  // const [loadingRef, handleChangeChecked] = useLoading((e: boolean) =>
  //   item$.pipe(
  //     take(1),
  //     concatMap((item) => dataService.update({ ...item, status: e ? ETodoStatus.DONE : ETodoStatus.PENDING })),
  //   ),
  // );

  // const openRef = ref(false);
  return (
    <div class="h-10 flex flex-row items-center space-x-2 pr-4 group">
      <Loader2 class="animate-spin w-4 h-4 flex-none" width={16} height={16} />
      <AutoTooltip
        id={props.id}
        className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
      />
      <div class="flex-auto" />
    </div>
  );
};
