'use client';

import type { ETodoListType } from '@todo/interface';
import type { FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { areArraysEqual, IDataService } from '@todo/interface';
import { memo, useMemo, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { of } from 'rxjs';
import { delay, distinctUntilChanged, map, pairwise, startWith, switchMap } from 'rxjs/operators';

import { useMounted, useObservableState } from '@/hooks';
import { getElementResize$ } from '@/lib/utils';

export interface ILoadingSketchProps {
  type: ETodoListType;
}

const defaultRowWidth = [364, 300, 332] as [number, number, number];

const LoadingSketchCore: FC<ILoadingSketchProps> = ({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dataService] = useState(() => ServiceLocator.default.get(IDataService));

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
      [type, dataService],
    ),
    defaultRowWidth,
    areArraysEqual,
  );

  const isMounted = useMounted();
  if (!isMounted) return <div ref={containerRef}>Todo Item Loading Sketch</div>;

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
