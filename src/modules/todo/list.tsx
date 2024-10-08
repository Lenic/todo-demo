import type { ETodoListType } from '@/api';
import type { CSSProperties, FC } from 'react';

import dayjs from 'dayjs';
import { useCallback, useMemo, useRef } from 'react';
import ContentLoader from 'react-content-loader';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { from } from 'rxjs';
import { auditTime, distinct, distinctUntilChanged, filter, map, mergeMap, toArray } from 'rxjs/operators';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useObservableState } from '@/hooks';
import { ServiceLocator } from '@/lib/injector';
import { windowResize$ } from '@/lib/utils';
import { IDataService, TODO_LIST_PAGE_SIZE } from '@/resources';

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

  const containerRef = useRef<HTMLDivElement>(null);

  const rowWidth = useObservableState(
    useMemo(
      () =>
        windowResize$.pipe(
          auditTime(60),
          map(() => {
            const rowWidth = containerRef.current?.clientWidth ?? 364;
            const contentWidth = rowWidth - 16 - (16 + 8) * 2;
            const dateIconLeft = rowWidth - 16 - 16;

            return [rowWidth, contentWidth, dateIconLeft] as const;
          }),
          distinctUntilChanged(),
        ),
      [],
    ),
    [364, 300, 332],
  );

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style}>
          <ContentLoader
            speed={0.5}
            width={rowWidth[0]}
            height={40}
            viewBox={`0 0 ${rowWidth[0]} 40`}
            backgroundColor="#d9d9d9"
            foregroundColor="#ededed"
          >
            <rect x="0" y="12" rx="1" ry="1" width="16" height="16" />
            <rect x="24" y="10" rx="4" ry="4" width={rowWidth[1]} height="20" />
            <rect x={rowWidth[2]} y="12" rx="1" ry="1" width="16" height="16" />
          </ContentLoader>
        </div>
      );
    } else {
      return <TodoItem style={style} key={ids[index]} id={ids[index]} dateFormatString={dateFormatString} />;
    }
  };

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
            {Row}
          </List>
        </ScrollArea>
      )}
    </InfiniteLoader>
  );
};
