import type { ETodoListType } from '@/api';
import type { FC } from 'react';

import dayjs from 'dayjs';
import { useCallback, useMemo, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { from } from 'rxjs';
import {
  auditTime,
  distinct,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  shareReplay,
  toArray,
  withLatestFrom,
} from 'rxjs/operators';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useObservableState, useObservableStore } from '@/hooks';
import { ServiceLocator } from '@/lib/injector';
import { windowResize$ } from '@/lib/utils';
import { areArraysEqual, IDataService } from '@/resources';

import { LoadingSketch } from './components/loading-sketch';
import { TodoItem } from './item';

export interface ITodoListProps {
  type: ETodoListType;
}

const dataService = ServiceLocator.default.get(IDataService);

export const TodoList: FC<ITodoListProps> = ({ type }) => {
  const ids$ = useMemo(
    () =>
      dataService.ids$.pipe(
        map((mapper) => mapper[type]),
        distinctUntilChanged(areArraysEqual),
        shareReplay(1),
      ),
    [type],
  );
  const ids = useObservableStore(ids$, dataService.ids[type]);

  const dateFormatString = useObservableState(
    useMemo(
      () =>
        dataService.dataMapper$.pipe(
          withLatestFrom(ids$, (mapper, ids) =>
            ids
              .map((id) => mapper[id].overdueAt)
              .filter((v) => !!v)
              .map((date) => dayjs(date).get('year')),
          ),
          filter((v) => !!v.length),
          mergeMap((list) =>
            from(list).pipe(
              distinct(),
              toArray(),
              map((innerList) => {
                const thisYear = dayjs().get('year');
                return innerList.filter((v) => v !== thisYear).length > 0 ? 'yyyy-MM-dd' : 'MM-dd';
              }),
            ),
          ),
          distinctUntilChanged(),
        ),
      [ids$],
    ),
    'MM-dd',
  );

  const handleLoadMore = useCallback(() => {
    return new Promise<void>((resolve) => {
      dataService.loadMore(type).subscribe(resolve);
    });
  }, [type]);

  const isEnd$ = useMemo(
    () =>
      dataService.ends$.pipe(
        map((ends) => ends[type]),
        distinctUntilChanged(),
        shareReplay(1),
      ),
    [type],
  );
  const isEnd = useObservableStore(isEnd$, dataService.ends[type]);

  const isItemLoaded = useCallback((index: number) => ids.length > index, [ids.length]);

  const containerRef = useRef<HTMLDivElement>(null);
  const listHeight = useObservableState(
    useMemo(
      () =>
        windowResize$.pipe(
          auditTime(60),
          map((v) => {
            if (v.width >= 768) return 240;
            return v.height - (containerRef.current?.getBoundingClientRect().top ?? 218) - 6;
          }),
          distinctUntilChanged(),
        ),
      [],
    ),
    240,
  );

  const itemCount = isEnd ? ids.length : ids.length + 1;
  return (
    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={handleLoadMore} threshold={3}>
      {({ onItemsRendered, ref }) => (
        <ScrollArea ref={containerRef}>
          <List
            ref={ref}
            width="100%"
            itemSize={40}
            height={listHeight}
            itemCount={itemCount}
            onItemsRendered={onItemsRendered}
          >
            {({ index, style }) => {
              if (!isItemLoaded(index)) {
                return (
                  <div key={index} style={style}>
                    <LoadingSketch type={type} />
                  </div>
                );
              } else {
                return <TodoItem style={style} key={ids[index]} id={ids[index]} dateFormatString={dateFormatString} />;
              }
            }}
          </List>
        </ScrollArea>
      )}
    </InfiniteLoader>
  );
};
