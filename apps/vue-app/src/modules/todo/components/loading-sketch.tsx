import type { ETodoListType } from '@todo/controllers';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService } from '@todo/controllers';
import { delay, distinctUntilChanged, filter, map, of, pairwise, startWith, switchMap } from 'rxjs';
import { defineComponent, type PropType, ref } from 'vue';
import { ContentLoader } from 'vue-content-loader';

import { useObservableShallowRef } from '@/hooks';
import { listenResize$ } from '@/lib/listen-resize';

const defaultRowWidth = [430, 366, 398] as [number, number, number];

const dataService = ServiceLocator.default.get(IDataService);

export const LoadingSketch = defineComponent({
  name: 'LoadingSketch',
  props: {
    type: { type: String as PropType<ETodoListType>, required: true },
  },
  setup(props) {
    const containerRef = ref<HTMLDivElement>();

    const rowWidthRef = useObservableShallowRef(
      dataService.ends$.pipe(
        map((ends) => ends[props.type]),
        distinctUntilChanged(),
        switchMap((isEnd) =>
          isEnd
            ? of(defaultRowWidth)
            : listenResize$(containerRef).pipe(
                map((list) => list[0]),
                filter((v) => !!v),
                map((v) => [v.contentRect.width, v.contentRect.height] as const),
                distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1]),
                startWith([0, 0] as const),
                pairwise(),
                switchMap((val) => {
                  const next$ = of(val[1][0]);
                  return val[0][1] !== val[1][1] ? next$ : next$.pipe(delay(100));
                }),
                distinctUntilChanged(),
                map((rowWidth) => {
                  const contentWidth = rowWidth - 16 - (16 + 8) * 2;
                  const dateIconLeft = rowWidth - 16 - 16;

                  return [rowWidth, contentWidth, dateIconLeft];
                }),
              ),
        ),
        distinctUntilChanged(areArraysEqual),
      ),
      defaultRowWidth,
    );

    return () => (
      <div ref={containerRef}>
        <ContentLoader
          speed={0.5}
          width={rowWidthRef.value[0]}
          height={40}
          viewBox={`0 0 ${String(rowWidthRef.value[0])} 40`}
          primaryColor="#d9d9d9"
          secondaryColor="#ededed"
        >
          <rect x="0" y="12" rx="1" ry="1" width="16" height="16" />
          <rect x="24" y="10" rx="4" ry="4" width={rowWidthRef.value[1]} height="20" />
          <rect x={rowWidthRef.value[2]} y="12" rx="1" ry="1" width="16" height="16" />
        </ContentLoader>
      </div>
    );
  },
});
