import { useMemo, type FC } from 'react';

import dayjs from 'dayjs';
import { TodoItem } from './item';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';
import { count, distinct, filter, map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { useObservableState } from '@/hooks';

export interface ITodoListProps {
  ids: string[];
}

export const TodoList: FC<ITodoListProps> = ({ ids }) => {
  const dateFormatString = useObservableState(
    useMemo(
      () =>
        ServiceLocator.default.get(IDataService).dataMapper$.pipe(
          mergeMap((mapper) =>
            from(ids).pipe(
              map((id) => mapper[id].overdueAt),
              filter((v) => !!v),
              map((date) => dayjs(date!).get('year')),
              distinct(),
              count(),
            ),
          ),
          map((count) => (count > 1 ? 'yyyy-MM-dd' : 'MM-dd')),
        ),
      [ids],
    ),
    'MM-dd',
  );

  return (
    <div className="flex flex-col space-y-2">
      {ids.map((id) => (
        <TodoItem key={id} id={id} dateFormatString={dateFormatString} />
      ))}
    </div>
  );
};
