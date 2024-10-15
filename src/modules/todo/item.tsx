import type { CheckedState } from '@radix-ui/react-checkbox';
import type { CSSProperties, FC } from 'react';

import { memo, useCallback, useMemo, useState } from 'react';
import { map, shareReplay } from 'rxjs/operators';

import { ETodoStatus } from '@/api';
import { Checkbox } from '@/components/ui/checkbox';
import { useObservableStore } from '@/hooks';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';

import { AutoTooltip } from './components/auto-tooltip';
import { RowDatePicker } from './components/row-data-picker';
import { TodoItemEditor } from './editor';

export interface ITodoItemProps {
  id: string;
  style: CSSProperties;
  dateFormatString: string;
}

const dataService = ServiceLocator.default.get(IDataService);

const TodoItemCore: FC<ITodoItemProps> = ({ id, dateFormatString, style }) => {
  const item = useObservableStore(
    useMemo(
      () =>
        dataService.dataMapper$.pipe(
          map((mapper) => mapper[id]),
          shareReplay(1),
        ),
      [id],
    ),
    dataService.dataMapper[id],
  );

  const description = item.description ?? item.title;

  const handleChangeChecked = useCallback(
    (e: CheckedState) => {
      dataService.update({ ...item, status: e === true ? ETodoStatus.DONE : ETodoStatus.PENDING });
    },
    [item],
  );

  const overdueAt = useMemo(() => (item.overdueAt ? new Date(item.overdueAt) : undefined), [item.overdueAt]);

  const [open, setOpen] = useState(false);
  const handleOpenEditor = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <div className="flex items-center space-x-2 pr-4" style={style}>
      <Checkbox checked={item.status === ETodoStatus.DONE} onCheckedChange={handleChangeChecked} />
      <AutoTooltip
        title={item.title}
        description={description}
        className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate"
        onClick={handleOpenEditor}
      />
      <div className="flex-auto" />
      <RowDatePicker className="flex-initial" id={id} value={overdueAt} formatString={dateFormatString} />
      <TodoItemEditor id={id} open={open} onOpenChange={setOpen} />
    </div>
  );
};
export const TodoItem = memo(
  TodoItemCore,
  (prev, next) => prev.id === next.id && prev.dateFormatString === next.dateFormatString,
);
