import { createComputed, createMemo, createSignal } from 'solid-js';

export interface VirtualizeProps {
  size: number;
  itemSize: number;
  totalCount: number;
  position: number;
  buffer?: number;
}

export interface Virtualized {
  start: number;
  end: number;
  count: number;
  margins: [number, number];
  dimension: number;
}

export function createVirtualized(
  size: () => number,
  itemSize: () => number,
  totalCount: () => number,
  position: () => number,
  buffer?: () => number | undefined,
): Virtualized {
  const [state, setState] = createSignal({
    start: 0,
    end: 0,
    count: 0,
  });

  const visibleRange = createMemo(
    () => {
      const size_ = size();
      const itemSize_ = itemSize();
      if (size_ <= 0 || itemSize_ <= 0) {
        return [0, 0];
      }
      const start = Math.floor(position() / itemSize_);
      return [start, start + Math.max(Math.ceil(size_ / itemSize_), 1)];
    },
    undefined,
    { equals: tuplesEqual },
  );

  createComputed(() => {
    const buffer_ = orDefault(buffer, 1);
    const [visStart, visEnd] = visibleRange();
    const start = Math.max(visStart - buffer_, 0);
    const end = Math.min(visEnd + buffer_, totalCount());
    setState({
      start,
      end,
      count: end - start,
    });
  });

  const margins = createMemo<[number, number]>(
    () => {
      const itemSize_ = itemSize();
      const { start, end } = state();
      return [start * itemSize_, (totalCount() - end) * itemSize_];
    },
    [0, 0],
    { equals: tuplesEqual },
  );

  const dimension = createMemo(() => state().count * itemSize(), 0);

  return {
    get start() {
      return state().start;
    },
    get end() {
      return state().end;
    },
    get count() {
      return state().count;
    },
    get margins() {
      return margins();
    },
    get dimension() {
      return dimension();
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- core method
function tuplesEqual<T extends any[]>(a: T, b: T) {
  if (a.length !== b.length) return false;

  return a.every((item, index) => item === b[index]);
}

function orDefault<T>(fn: (() => T | undefined) | undefined, fallback: T) {
  const value = fn ? fn() : undefined;
  return value ?? fallback;
}
