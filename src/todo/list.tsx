import type { ETodoListType } from '@/api';
import type { CSSProperties, FC } from 'react';

import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { from } from 'rxjs';
import { distinct, filter, map, mergeMap, toArray } from 'rxjs/operators';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useObservableState } from '@/hooks';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';

import { TodoItem } from './item';

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
      dataService.loadMore(type).subscribe(resolve);
    });
  }, [type]);

  const isItemLoaded = useCallback((index: number) => ids.length > index, [ids.length]);

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>;
    } else {
      return <TodoItem style={style} key={ids[index]} id={ids[index]} dateFormatString={dateFormatString} />;
    }
  };

  const itemCount = isEnd ? ids.length : ids.length + 1;
  return (
    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={handleLoadMore} threshold={3}>
      {({ onItemsRendered, ref }) => (
        <ScrollArea>
          <List
            ref={ref}
            width={492}
            height={240}
            itemSize={40}
            itemCount={itemCount}
            onItemsRendered={onItemsRendered}
          >
            {Row}
          </List>
        </ScrollArea>
      )}
    </InfiniteLoader>
  );
};
