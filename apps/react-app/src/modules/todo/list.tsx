import type { ETodoListType } from '@todo/controllers';
import type { FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService, TODO_LIST_PAGE_SIZE } from '@todo/controllers';
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
import { useIntl } from '@/i18n';
import { windowResize$ } from '@/lib/utils';

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

  const { t } = useIntl('todo.list');
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
                return innerList.filter((v) => v !== thisYear).length > 0 ? t('full-date') : t('short-date');
              }),
            ),
          ),
        ),
      [ids$, t],
    ),
    t('short-date'),
  );

  const handleLoadMore = useCallback(() => {
    return new Promise<void>((resolve) => {
      dataService.loadMore(type).subscribe(resolve);
    });
  }, [type]);

  const isEnd = useObservableStore(
    useMemo(() => dataService.ends$.pipe(map((ends) => ends[type])), [type]),
    dataService.ends[type],
  );

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
        ),
      [],
    ),
    240,
  );

  const itemCount = isEnd ? ids.length : ids.length + TODO_LIST_PAGE_SIZE;
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
            overscanCount={TODO_LIST_PAGE_SIZE}
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
