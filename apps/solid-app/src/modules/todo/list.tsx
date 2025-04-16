import { ServiceLocator } from '@todo/container';
import { areArraysEqual, ETodoListType, IDataService } from '@todo/interface';
import dayjs from 'dayjs';
import {
  auditTime,
  combineLatest,
  distinct,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  filter,
  from,
  map,
  merge,
  of,
  shareReplay,
  skip,
  switchMap,
  take,
  toArray,
} from 'rxjs';

import { VirtualizedList } from '@/components/virtualized';
import { useObservableEffect, useObservableRef, useObservableSignal, useUpdate } from '@/hooks';
import { useIntl } from '@/i18n';
import { windowResize$ } from '@/libs/listen-resize';

import { LoadingSketch } from './components/loading-sketch';
import { TodoItem } from './item';

const dataService = ServiceLocator.default.get(IDataService);

const DEFAULT_LIST_HEIGHT = 240;

const loadingItems = new Array<string>(10).fill('-1-');

export interface TodoListProps {
  type: ETodoListType;
}

export const TodoList = (props: TodoListProps) => {
  const ids$ = dataService.ids$.pipe(
    map((mapper) => mapper[props.type]),
    distinctUntilChanged(areArraysEqual),
    shareReplay(1),
  );
  const ids = useObservableSignal(
    ids$.pipe(
      switchMap((list) =>
        dataService.ends$.pipe(
          map((mapper) => mapper[props.type]),
          map((isEnd) => (isEnd ? list : list.concat(loadingItems))),
        ),
      ),
    ),
    loadingItems,
  );

  const { t } = useIntl('todo.list');
  const dateFormatString = useObservableSignal(
    ids$.pipe(
      switchMap((ids) =>
        dataService.dataMapper$.pipe(
          map((mapper) =>
            ids
              .map((id) => mapper[id].overdueAt)
              .filter((v) => !!v)
              .map((date) => dayjs(date).get('year')),
          ),
        ),
      ),
      filter((v) => !!v.length),
      switchMap((list) =>
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
    t('short-date'),
  );

  const [setScroller, distance$] = useObservableRef<number>();
  useObservableEffect(
    combineLatest([
      distance$.pipe(filter((v) => typeof v !== 'undefined')),
      dataService.ends$.pipe(map((mapper) => mapper[props.type])),
    ]).pipe(
      filter(([distance, end]) => !end && distance < 400),
      exhaustMap(() => (dataService.ends[props.type] ? EMPTY : dataService.loadMore(props.type))),
    ),
  );

  const refresh$ = useUpdate();
  const [containerRef, container$] = useObservableRef<HTMLDivElement>();
  const listHeight = useObservableSignal(
    merge(
      refresh$.pipe(
        switchMap(() => windowResize$),
        take(1),
      ),
      windowResize$.pipe(skip(1), auditTime(60)),
    ).pipe(
      switchMap((v) => {
        if (v[0] >= 768) return of(DEFAULT_LIST_HEIGHT);

        return container$.pipe(map((el) => v[1] - (el?.getBoundingClientRect().top ?? 218) - 6));
      }),
    ),
    DEFAULT_LIST_HEIGHT,
  );

  const renderItem = (index: number) => {
    const id = ids()[index];
    if (id == '-1-') {
      return <LoadingSketch type={ETodoListType.PENDING} />;
    } else {
      return <TodoItem id={id} dateFormatString={dateFormatString()} />;
    }
  };

  return (
    <div ref={containerRef}>
      <VirtualizedList
        height={listHeight()}
        itemHeight={40}
        totalCount={ids().length}
        buffer={1}
        onScroll={setScroller}
      >
        {renderItem}
      </VirtualizedList>
    </div>
  );
};
