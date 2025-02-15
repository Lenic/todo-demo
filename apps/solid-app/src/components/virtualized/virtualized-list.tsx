import type { JSX } from 'solid-js';

import { createComputed, createEffect, on, splitProps } from 'solid-js';

import Range from './range';
import { createScrollSync } from './scroll-sync';
import { createVirtualized } from './virtualize';

export interface VirtualizedListProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onScroll'> {
  height: number;
  itemHeight: number;
  totalCount: number;
  buffer?: number;
  children: (index: number) => JSX.Element;
  onScroll?: (marginBottom: number) => void;
}

export function VirtualizedList(props: VirtualizedListProps) {
  const [, rest] = splitProps(props, ['height', 'itemHeight', 'totalCount', 'buffer', 'children', 'style', 'onScroll']);

  const [setScroll, onScroll, scrollState] = createScrollSync();
  const virtualized = createVirtualized(
    () => props.height,
    () => props.itemHeight,
    () => props.totalCount,
    () => scrollState().top,
    () => props.buffer,
  );

  createEffect(
    on(
      () => props.totalCount,
      async () => {
        await Promise.resolve();
        props.onScroll?.(virtualized.margins[1]);
      },
    ),
  );

  createComputed(() => {
    props.onScroll?.(virtualized.margins[1]);
  });

  return (
    <div
      class="overflow-x-hidden overflow-y-auto"
      onScroll={onScroll.vertical}
      ref={setScroll.vertical}
      style={{
        ...(props.style as JSX.CSSProperties),
        height: `${props.height.toString()}px`,
      }}
      {...rest}
    >
      <ul
        style={{
          'margin-top': `${virtualized.margins[0].toString()}px`,
          height: `${(virtualized.dimension + virtualized.margins[1]).toString()}px`,
        }}
      >
        <Range start={virtualized.start} count={virtualized.count}>
          {(index) => <li>{props.children(index)}</li>}
        </Range>
      </ul>
    </div>
  );
}
