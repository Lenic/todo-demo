import type { CheckedState } from '@radix-ui/react-checkbox';
import type { CSSProperties, FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/interface';
import { clsx } from 'clsx';
import { EllipsisVertical } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { concatMap, distinctUntilChanged, filter, map, shareReplay, take } from 'rxjs/operators';

import { useLoading, useObservableState } from '@/hooks';

import { AutoTooltip } from './components/auto-tooltip';
import { RowDropdownMenu } from './components/row-dropdown-menu';

export interface ITodoItemProps {
  id: string;
  style: CSSProperties;
  dateFormatString: string;
}

const TodoItemCore: FC<ITodoItemProps> = ({ id, dateFormatString, style }) => {
  const [dataService] = useState(() => ServiceLocator.default.get(IDataService));
  const item$ = useMemo(
    () =>
      dataService.dataMapper$.pipe(
        map((mapper) => mapper[id]),
        distinctUntilChanged(),
        filter((v) => !!v),
        shareReplay(1),
      ),
    [id, dataService],
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
    </div>
  );
};
export const TodoItem = memo(
  TodoItemCore,
  (prev, next) => prev.id === next.id && prev.dateFormatString === next.dateFormatString,
);
