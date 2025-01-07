import type { ETodoListType } from '@todo/controllers';
import type { Observable } from 'rxjs';
import type { CSSProperties, PropType } from 'vue';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService, TODO_LIST_PAGE_SIZE } from '@todo/controllers';
import dayjs from 'dayjs';
import {
  auditTime,
  concatMap,
  distinct,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  filter,
  from,
  map,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs';
import { defineComponent, ref } from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useObservableEffect,
  useObservableRef,
  useObservableShallowRef,
  useObservableWatch,
  useScrollListener,
} from '@/hooks';
import { useIntl } from '@/i18n';
import { windowResize$ } from '@/lib/utils';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

// import { TodoItem } from './item';

export interface ITodoListProps {
  type: ETodoListType;
}

export interface ITodoItemRenderer {
  item: string;
  index: number;
}

const dataService = ServiceLocator.default.get(IDataService);

const defaultListStyle: CSSProperties = { height: '240px' };

const loadingIds: string[] = [];
for (let i = 0; i < TODO_LIST_PAGE_SIZE; i++) {
  loadingIds.push(`###${i.toString()}`);
}

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
    const idsRef = useObservableShallowRef(ids$, dataService.ids[props.type]);

    const { t } = useIntl('todo.list');
    const dateFormatString = useObservableShallowRef(
      dataService.dataMapper$.pipe(
        withLatestFrom(ids$, (mapper, ids) =>
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
      t('short-date'),
    );

    const [containerRef, targetRef, entry$] = useScrollListener();
    useObservableEffect(
      entry$
        .pipe(
          startWith({ intersectionRatio: -1 } as IntersectionObserverEntry),
          pairwise(),
          filter(([prev, curr]) => prev.intersectionRatio < curr.intersectionRatio && curr.intersectionRatio > 0),
          map((v) => v[1]),
          switchMap(() => dataService.ends$.pipe(map((mapper) => mapper[props.type]))),
          exhaustMap((isEnd) => (isEnd ? EMPTY : dataService.loadMore(props.type))),
        )
        .subscribe(),
    );

    const scrollerRef = ref<{ viewportElement$: Observable<HTMLDivElement> }>();
    const scroller$ = useObservableWatch(scrollerRef);
    const scrollContainerRef = useObservableRef(
      scroller$.pipe(
        filter((v) => !!v),
        switchMap((v) => v.viewportElement$),
        tap((el) => {
          containerRef.value = el;
        }),
      ),
    );

    const listStyle = useObservableShallowRef(
      windowResize$.pipe(
        auditTime(60),
        map((v) => {
          if (v.width >= 768) return defaultListStyle;

          const height = v.height - (scrollContainerRef.value?.getBoundingClientRect().top ?? 218) - 6;
          return { height: `${height.toString()}px` } as CSSProperties;
        }),
      ),
      defaultListStyle,
    );

    const renderItem = ({ item }: ITodoItemRenderer) => (
      <div key={item}>
        {item}-{dateFormatString}
      </div>
    );

    const renderAfterRef = useObservableShallowRef(
      dataService.ends$.pipe(
        map((mapper) => mapper[props.type]),
        map(
          (isEnd) => () =>
            isEnd ? null : (
              <div ref={targetRef}>
                {loadingIds.map((id) => (
                  <div key={id} class="h-10">
                    <div>loading</div>
                  </div>
                ))}
              </div>
            ),
        ),
      ),
      null,
    );

    return () => (
      <ScrollArea ref={scrollerRef} style={listStyle.value}>
        <RecycleScroller
          itemSize={40}
          items={idsRef.value}
          v-slots={{ default: renderItem, after: renderAfterRef.value }}
        />
      </ScrollArea>
    );
  },
});
// <LoadingSketch type={type} />
// <TodoItem style={style} key={ids[index]} id={ids[index]} dateFormatString={dateFormatString} />
