import type { ETodoListType } from '@/api';
import type { FC } from 'react';

import { memo, useMemo, useRef } from 'react';
import ContentLoader from 'react-content-loader';
import { of } from 'rxjs';
import { delay, distinctUntilChanged, map, pairwise, startWith, switchMap } from 'rxjs/operators';

import { useObservableState } from '@/hooks';
import { ServiceLocator } from '@/lib/injector';
import { getElementResize$ } from '@/lib/utils';
import { areArraysEqual, IDataService } from '@/resources';

export interface ILoadingSketcProps {
  type: ETodoListType;
}

const defaultRowWidth = [364, 300, 332] as [number, number, number];

const dataService = ServiceLocator.default.get(IDataService);

const LoadingSketchCore: FC<ILoadingSketcProps> = ({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rowWidth = useObservableState(
    useMemo(
      () =>
        dataService.ends$.pipe(
          map((ends) => ends[type]),
          distinctUntilChanged(),
          switchMap((isEnd) =>
            isEnd || !containerRef.current
              ? of(defaultRowWidth)
              : getElementResize$(containerRef.current, (v) => [v.clientWidth, v.clientHeight] as const).pipe(
                  distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1]),
                  startWith([0, 0] as const),
                  pairwise(),
                  switchMap((val) => {
                    const next$ = of(val[1][0]);
                    return val[0][1] !== val[1][1] ? next$ : next$.pipe(delay(2000));
                  }),
                  distinctUntilChanged(),
                  map((rowWidth) => {
                    const contentWidth = rowWidth - 16 - (16 + 8) * 2;
                    const dateIconLeft = rowWidth - 16 - 16;

                    return [rowWidth, contentWidth, dateIconLeft];
                  }),
                ),
          ),
        ),
      [type],
    ),
    defaultRowWidth,
    areArraysEqual,
  );

  return (
    <div ref={containerRef}>
      <ContentLoader
        speed={0.5}
        width={rowWidth[0]}
        height={40}
        viewBox={`0 0 ${String(rowWidth[0])} 40`}
        backgroundColor="#d9d9d9"
        foregroundColor="#ededed"
      >
        <rect x="0" y="12" rx="1" ry="1" width="16" height="16" />
        <rect x="24" y="10" rx="4" ry="4" width={rowWidth[1]} height="20" />
        <rect x={rowWidth[2]} y="12" rx="1" ry="1" width="16" height="16" />
      </ContentLoader>
    </div>
  );
};
export const LoadingSketch = memo(LoadingSketchCore);
