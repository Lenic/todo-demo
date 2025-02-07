import type { ETodoListType } from '@todo/controllers';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService } from '@todo/controllers';
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
  tap,
  toArray,
} from 'rxjs';

import { VirtualizedList } from '@/components/virtualized';
import {
  EUpdateType,
  useObservableEffect,
  useObservableRef,
  useObservableSignal,
  useScrollListener,
  useUpdate,
} from '@/hooks';
import { useIntl } from '@/i18n';
import { windowResize$ } from '@/libs/listen-resize';

// import { LoadingSketch } from './components/loading-sketch';
// import { TodoItem } from './item';

const dataService = ServiceLocator.default.get(IDataService);

const DEFAULT_LIST_HEIGHT = 240;

const loadingItems = new Array<string>(10).fill('-1-');
loadingItems[0] = '-0-';

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

  const refresh$ = useUpdate(EUpdateType.ALL, ids);
  const [scrollRef, distance$] = useObservableRef<number>();
  combineLatest([
    distance$.pipe(filter((v) => typeof v !== 'undefined')),
    dataService.ends$.pipe(map((mapper) => mapper[props.type])),
  ]).pipe(
    filter(([distance, end]) => !end && distance < 400),
    exhaustMap(() =>
      dataService.ends[props.type]
        ? EMPTY
        : dataService.loadMore(props.type).pipe(
            tap(() =>
              refresh$
                .pipe(
                  filter((v) => v === EUpdateType.UPDATED),
                  take(1),
                )
                .subscribe(handleCheck),
            ),
          ),
    ),
  );
  const [refs, entry$, handleCheck] = useScrollListener();
  useObservableEffect(
    entry$
      .pipe(
        map((v) => v.intersectionRatio),
        filter((v) => v > 0),
      )
      .subscribe(),
  );

  const listHeight = useObservableSignal(
    merge(
      refresh$.pipe(
        filter((v) => v === EUpdateType.MOUNTED),
        switchMap(() => windowResize$),
        take(1),
      ),
      windowResize$.pipe(skip(1), auditTime(60)),
    ).pipe(
      switchMap((v) => {
        if (v[0] >= 768) return of(DEFAULT_LIST_HEIGHT);

        return refs.container$.pipe(map((el) => v[1] - (el?.getBoundingClientRect().top ?? 218) - 6));
      }),
    ),
    DEFAULT_LIST_HEIGHT,
  );

  const renderItem = (index: number) => {
    const id = ids()[index];
    if (id === '-0-') {
      return (
        <div ref={refs.target} class="h-10">
          Loading 0
        </div>
      );
    } else if (id == '-1-') {
      return <div class="h-10">Loading {index}</div>;
    } else {
      return (
        <div class="h-10">
          Item: {index} - {id} - {dateFormatString()}
        </div>
      );
    }
  };

  return (
    <div ref={refs.container}>
      <VirtualizedList height={listHeight()} itemHeight={40} totalCount={ids().length} buffer={1} onScroll={scrollRef}>
        {renderItem}
      </VirtualizedList>
    </div>
  );
};
