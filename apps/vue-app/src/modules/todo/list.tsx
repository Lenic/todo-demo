import type { ETodoListType } from '@todo/controllers';
import type { CSSProperties, PropType } from 'vue';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService, TODO_LIST_PAGE_SIZE } from '@todo/controllers';
import dayjs from 'dayjs';
import {
  auditTime,
  distinct,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  filter,
  from,
  map,
  merge,
  shareReplay,
  skip,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs';
import { defineComponent } from 'vue';
// @ts-expect-error 7016 -- this package doesn't have the type definition.
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

import { EUpdateType, useObservableEffect, useObservableShallowRef, useScrollListener, useUpdate } from '@/hooks';
import { useIntl } from '@/i18n';
import { windowResize$ } from '@/lib/utils';

import { LoadingSketch } from './components/loading-sketch';
import { TodoItem } from './item';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export interface ITodoIdentity {
  id: string;
  type: 'item' | 'polyfill';
}

export interface ITodoItemRenderer {
  item: ITodoIdentity;
  index: number;
  active: boolean;
}

const dataService = ServiceLocator.default.get(IDataService);

const defaultListStyle: CSSProperties = { height: '240px' };

const loadingItems: ITodoIdentity[] = [{ id: `###0`, type: 'polyfill' }];

export const TodoList = defineComponent({
  name: 'TodoList',
  props: {
    type: {
      type: String as PropType<ETodoListType>,
      required: true,
    },
  },
  setup(props) {
    const ids$ = dataService.ids$.pipe(
      map((mapper) => mapper[props.type]),
      distinctUntilChanged(areArraysEqual),
      shareReplay(1),
    );
    const idsRef = useObservableShallowRef(
      ids$.pipe(
        map((ids) => ids.map((id) => ({ id, type: 'item' }) as ITodoIdentity)),
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
    const dateFormatString = useObservableShallowRef(
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

    const refresh$ = useUpdate(EUpdateType.ALL);
    const [refs, entry$, handleCheck] = useScrollListener();
    useObservableEffect(
      entry$
        .pipe(
          map((v) => v.intersectionRatio),
          filter((v) => v > 0),
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
        )
        .subscribe(),
    );

    const listStyle = useObservableShallowRef(
      merge(
        refresh$.pipe(
          filter((v) => v === EUpdateType.MOUNTED),
          switchMap(() => windowResize$),
          take(1),
        ),
        windowResize$.pipe(skip(1), auditTime(60)),
      ).pipe(
        map((v) => {
          if (v.width >= 768) return defaultListStyle;

          const height = v.height - (refs.container.value?.getBoundingClientRect().top ?? 218) - 6;
          return { height: `${height.toString()}px` } as CSSProperties;
        }),
      ),
      defaultListStyle,
    );

    return () => (
      <div ref={refs.container}>
        <DynamicScroller minItemSize={40} buffer={10} items={idsRef.value} style={listStyle.value}>
          {({ item, active }: ITodoItemRenderer) => (
            <DynamicScrollerItem key={item.id} item={item} active={active} sizeDependencies={[item.type]}>
              {item.id === '###0' ? (
                <div ref={refs.target}>
                  {new Array<number>(TODO_LIST_PAGE_SIZE).fill(0).map((_, index) => (
                    <LoadingSketch key={index} type={props.type} />
                  ))}
                </div>
              ) : (
                <TodoItem id={item.id} dateFormatString={dateFormatString.value} />
              )}
            </DynamicScrollerItem>
          )}
        </DynamicScroller>
      </div>
    );
  },
});
