'use client';

import type { ETodoListType, ITodoItem } from '@todo/interface';
import type { FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService, TODO_LIST_PAGE_SIZE } from '@todo/interface';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { firstValueFrom, from } from 'rxjs';
import {
  auditTime,
  concatMap,
  distinct,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  toArray,
  withLatestFrom,
} from 'rxjs/operators';

import { useObservableState } from '@/hooks';
import { useIntl } from '@/i18n';
import { windowResize$ } from '@/lib/utils';

const LoadingSketch = dynamic(() => import('./components/loading-sketch').then((v) => v.LoadingSketch), {
  ssr: false,
  loading: () => <div>Item Loading Sketch</div>,
});

export interface ITodoListProps {
  type: ETodoListType;
  data?: ITodoItem[];
}

let isFirstLoading = true;
export const TodoList: FC<ITodoListProps> = ({ type, data }) => {
  const [dataService] = useState(() => ServiceLocator.default.get(IDataService));
  if (isFirstLoading) {
    isFirstLoading = false;
    dataService.append(data ?? []);
  }

  const ids$ = useMemo(
    () =>
      dataService.ids$.pipe(
        map((mapper) => mapper[type]),
        distinctUntilChanged(areArraysEqual),
        shareReplay(1),
      ),
    [type, dataService],
  );
  const ids = useObservableState(ids$, dataService.ids[type]);

  const { t } = useIntl('todo.list');
  const dateFormatString = useObservableState(
    useMemo(
      () =>
        dataService.dataMapper$.pipe(
          withLatestFrom(ids$, (mapper: Record<string, ITodoItem>, ids) =>
            ids
              .map((id) => mapper[id].overdueAt)
              .filter((v) => !!v)
              .map((date) => dayjs(date).get('year')),
          ),
          filter((v) => !!v.length),
          concatMap((list) =>
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
      [ids$, t, dataService],
    ),
    t('short-date'),
  );

  const handleLoadMore = useCallback(() => firstValueFrom(dataService.loadMore(type)), [type, dataService]);

  const isEnd = useObservableState(
    useMemo(() => dataService.ends$.pipe(map((ends) => ends[type])), [type, dataService]),
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
        <div id="abc" ref={containerRef}>
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
                return <div key={ids[index]}>{ids[index]}</div>;
              }
            }}
          </List>
        </div>
      )}
    </InfiniteLoader>
  );
};

// <TodoItem style={style} key={ids[index]} id={ids[index]} dateFormatString={dateFormatString} />;
