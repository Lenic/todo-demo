import type { ETodoListType } from '@todo/controllers';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService } from '@todo/controllers';
import { delay, distinctUntilChanged, map, of, pairwise, startWith, switchMap } from 'rxjs';

import { ContentLoader } from '@/components/content-loader';
import { useObservableRef, useObservableSignal } from '@/hooks';
import { listenResize$ } from '@/libs/listen-resize';

const defaultRowWidth = [430, 366, 398] as [number, number, number];

const dataService = ServiceLocator.default.get(IDataService);

export interface LoadingSketchProps {
  type: ETodoListType;
}

export const LoadingSketch = (props: LoadingSketchProps) => {
  const [containerRef, container$] = useObservableRef<HTMLDivElement>();

  const rowWidth = useObservableSignal(
    dataService.ends$.pipe(
      map((ends) => ends[props.type]),
      distinctUntilChanged(),
      switchMap((isEnd) =>
        isEnd
          ? of(defaultRowWidth)
          : container$.pipe(
              switchMap((el) => listenResize$(el)),
              distinctUntilChanged(areArraysEqual),
              startWith([0, 0] as [number, number]),
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

  return (
    <div ref={containerRef}>
      <ContentLoader speed={0.5} width={rowWidth()[0]} height={40} secondaryColor="#ededed">
        <rect x="0" y="12" rx="1" ry="1" width="16" height="16" />
        <rect x="24" y="10" rx="4" ry="4" width={rowWidth()[1]} height="20" />
        <rect x={rowWidth()[2]} y="12" rx="1" ry="1" width="16" height="16" />
      </ContentLoader>
    </div>
  );
};
