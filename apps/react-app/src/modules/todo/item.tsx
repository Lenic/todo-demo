import type { CheckedState } from '@radix-ui/react-checkbox';
import type { CSSProperties, FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/interface';
import { clsx } from 'clsx';
import { EllipsisVertical, Loader2 } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { concatMap, distinctUntilChanged, filter, map, shareReplay, take } from 'rxjs/operators';

import { Checkbox } from '@/components/ui/checkbox';
import { useLoading, useObservableState } from '@/hooks';

import { AutoTooltip } from './components/auto-tooltip';
import { RowDatePicker } from './components/row-data-picker';
import { RowDropdownMenu } from './components/row-dropdown-menu';
import { TodoItemEditor } from './editor';

export interface ITodoItemProps {
  id: string;
  style: CSSProperties;
  dateFormatString: string;
}

const dataService = ServiceLocator.default.get(IDataService);

const TodoItemCore: FC<ITodoItemProps> = ({ id, dateFormatString, style }) => {
  const item$ = useMemo(
    () =>
      dataService.dataMapper$.pipe(
        map((mapper) => mapper[id]),
        distinctUntilChanged(),
        filter((v) => !!v),
        shareReplay(1),
      ),
    [id],
  );
  const item = useObservableState(item$, dataService.dataMapper[id]);

  const [loading, handleChangeChecked] = useLoading((e: CheckedState) =>
    item$.pipe(
      take(1),
      concatMap((item) => dataService.update({ ...item, status: e === true ? ETodoStatus.DONE : ETodoStatus.PENDING })),
    ),
  );

  const [open, setOpen] = useState(false);
  const handleOpenEditor = useCallback(() => {
    setOpen(true);
  }, []);

  const overdueAt = useMemo(() => (item.overdueAt ? new Date(item.overdueAt) : undefined), [item.overdueAt]);
  return (
    <div className="flex group items-center space-x-2 pr-4" style={style}>
      {loading ? (
        <Loader2 className="animate-spin min-w-4" width={16} height={16} />
      ) : (
        <Checkbox checked={item.status === ETodoStatus.DONE} onCheckedChange={handleChangeChecked} />
      )}
      <AutoTooltip
        id={item.id}
        className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate"
      />
      <div className="flex-auto" />
      <RowDropdownMenu id={id} onDetail={handleOpenEditor}>
        {(open: boolean) => (
          <EllipsisVertical
            className={clsx('h-4 w-0 group-hover:w-4 group-hover:opacity-100 transition-all ease-in-out duration-300', {
              'opacity-0 w-0': !open,
              '!w-4': open,
            })}
          />
        )}
      </RowDropdownMenu>
      <RowDatePicker className="flex-initial" id={id} value={overdueAt} formatString={dateFormatString} />
      <TodoItemEditor id={id} open={open} onOpenChange={setOpen} />
    </div>
  );
};
export const TodoItem = memo(
  TodoItemCore,
  (prev, next) => prev.id === next.id && prev.dateFormatString === next.dateFormatString,
);
