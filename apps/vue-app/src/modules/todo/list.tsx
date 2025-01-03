import type { ETodoListType, ITodoItem } from '@todo/controllers';
import type { PropType } from 'vue';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService, TODO_LIST_PAGE_SIZE } from '@todo/controllers';
import dayjs from 'dayjs';
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
import { defineComponent, onMounted, ref } from 'vue';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useObservableShallowRef } from '@/hooks';
import { useIntl } from '@/i18n';
import { windowResize$ } from '@/lib/utils';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

// import { TodoItem } from './item';

export interface ITodoListProps {
  type: ETodoListType;
}

const dataService = ServiceLocator.default.get(IDataService);

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
    const ids = useObservableShallowRef(ids$, dataService.ids[props.type]);

    const { t } = useIntl('todo.list');
    const dateFormatString = useObservableShallowRef(
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
      t('short-date'),
    );

    const handleLoadMore = () => firstValueFrom(dataService.loadMore(props.type));
    onMounted(() => handleLoadMore());

    const isEnd = useObservableShallowRef(
      dataService.ends$.pipe(map((ends) => ends[props.type])),
      dataService.ends[props.type],
    );

    const isItemLoaded = (index: number) => ids.length > index;

    const containerRef = ref<HTMLDivElement>();
    const listHeight = useObservableShallowRef(
      windowResize$.pipe(
        auditTime(60),
        map((v) => {
          if (v.width >= 768) return 240;
          return v.height - (containerRef.value.current?.getBoundingClientRect().top ?? 218) - 6;
        }),
      ),
      240,
    );

    const itemCount = isEnd ? ids.length : ids.length + TODO_LIST_PAGE_SIZE;
    return () => (
      <ScrollArea ref={containerRef}>
        {ids.value.map((id) => (
          <div key={id}>{id}</div>
        ))}
      </ScrollArea>
    );
  },
});
// <LoadingSketch type={type} />
// <TodoItem style={style} key={ids[index]} id={ids[index]} dateFormatString={dateFormatString} />
