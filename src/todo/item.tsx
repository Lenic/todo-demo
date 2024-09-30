import type { FC } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';

import { useCallback, useMemo, useState } from 'react';
import { map, take } from 'rxjs/operators';
import { ServiceLocator } from '@/lib/injector';
import { useObservableState } from '@/hooks';
import { Checkbox } from '@/components/ui/checkbox';

import { IDataService, ETodoStatus } from '../resources';

import { TodoItemEditor } from './editor';

export interface ITodoItemProps {
  id: string;
}

export const TodoItem: FC<ITodoItemProps> = ({ id }) => {
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
        dataService.addOrUpdate({ ...item, status: e === true ? ETodoStatus.DONE : ETodoStatus.PENDING });
      });
    },
    [item$, dataService],
  );

  const [open, setOpen] = useState(false);
  const handleOpenEditor = useCallback(() => setOpen(true), []);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={checked} onCheckedChange={handleChangeChecked} />
      <label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        onClick={handleOpenEditor}
      >
        {title}
      </label>
      <TodoItemEditor id={id} open={open} onOpenChange={setOpen} />
    </div>
  );
};
