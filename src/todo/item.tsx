import type { FC } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';

import { useCallback, useMemo, useState } from 'react';
import { map, take } from 'rxjs/operators';
import { ServiceLocator } from '@/lib/injector';
import { useObservableState } from '@/hooks';
import { Checkbox } from '@/components/ui/checkbox';

import { IDataService } from '../resources';
import { ETodoStatus } from '@/api';
import { TodoItemEditor } from './editor';
import { RowDatePicker } from './components/row-data-picker';

export interface ITodoItemProps {
  id: string;
  dateFormatString: string;
}

export const TodoItem: FC<ITodoItemProps> = ({ id, dateFormatString }) => {
  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);
  const item$ = useMemo(() => dataService.dataMapper$.pipe(map((mapper) => mapper[id])), [dataService, id]);

  const checked = useObservableState(
    useMemo(() => item$.pipe(map((item) => item.status === ETodoStatus.DONE)), [item$]),
    false,
  );

  const title = useObservableState(
    useMemo(() => item$.pipe(map((item) => item.title)), [item$]),
    '',
  );

  const handleChangeChecked = useCallback(
    (e: CheckedState) => {
      item$.pipe(take(1)).subscribe((item) => {
        dataService.update({ ...item, status: e === true ? ETodoStatus.DONE : ETodoStatus.PENDING });
      });
    },
    [item$, dataService],
  );

  const overdueAt = useObservableState(
    useMemo(() => item$.pipe(map((item) => (item.overdueAt ? new Date(item.overdueAt) : undefined))), [item$]),
    undefined,
  );

  const [open, setOpen] = useState(false);
  const handleOpenEditor = useCallback(() => setOpen(true), []);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={checked} onCheckedChange={handleChangeChecked} />
      <label
        className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate"
        onClick={handleOpenEditor}
      >
        {title}
      </label>
      <div className="flex-auto" />
      <RowDatePicker className="flex-initial" id={id} value={overdueAt} formatString={dateFormatString} />
      <TodoItemEditor id={id} open={open} onOpenChange={setOpen} />
    </div>
  );
};
