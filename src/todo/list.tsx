import { useCallback, useMemo, FC } from 'react';

import dayjs from 'dayjs';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { TodoItem } from './item';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';
import { distinct, filter, map, mergeMap, take, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { useObservableState } from '@/hooks';
import { ETodoListType } from '@/api';

export interface ITodoListProps {
  ids: string[];
  type: ETodoListType;
}

const dataService = ServiceLocator.default.get(IDataService);

export const TodoList: FC<ITodoListProps> = ({ ids, type }) => {
  const dateFormatString = useObservableState(
    useMemo(
      () =>
        dataService.dataMapper$.pipe(
          mergeMap((mapper) =>
            from(ids).pipe(
              map((id) => mapper[id].overdueAt),
              filter((v) => !!v),
              map((date) => dayjs(date!).get('year')),
              distinct(),
              toArray(),
              map((list) => {
                const thisYear = dayjs().get('year');
                return list.filter((v) => v !== thisYear).length > 0 ? 'yyyy-MM-dd' : 'MM-dd';
              }),
            ),
          ),
        ),
      [ids],
    ),
    'MM-dd',
  );

  const isEnd = useObservableState(
    useMemo(() => dataService.ends$.pipe(map((ends) => ends[type])), [type]),
    dataService.ends[type],
  );

  const handleLoadMore = useCallback(() => {
    return new Promise<void>((resolve) => {
      dataService.loadMore(type).pipe(take(1)).subscribe(resolve);
    });
  }, [type]);

  return (
    <div className="flex flex-col space-y-2">
      <InfiniteScroll hasMore={!isEnd} loadMore={handleLoadMore}>
        {ids.map((id) => (
          <TodoItem key={id} id={id} dateFormatString={dateFormatString} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
