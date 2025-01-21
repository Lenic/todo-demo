import type { Accessor } from 'solid-js';

import { createEffect, createSignal } from 'solid-js';

interface ScrollHandlers {
  (evt: Event): void;
  vertical: (evt: Event) => void;
  horizontal: (evt: Event) => void;
}

interface ScrollSetters {
  (el: HTMLElement): void;
  vertical: (el: HTMLElement) => void;
  horizontal: (el: HTMLElement) => void;
}

interface ScrollPosition {
  top: number;
  left: number;
}

interface ScrollInfo extends ScrollPosition {
  isScrolling: boolean;
  dx: number;
  dy: number;
}

interface ScrollState extends ScrollInfo {
  source?: HTMLElement;
}

type Direction = 'vertical' | 'horizontal';

export function createScrollSync(): [ScrollSetters, ScrollHandlers, Accessor<ScrollInfo>] {
  const [scrollState, setScrollState] = createSignal<ScrollState>({
    source: undefined,
    top: 0,
    left: 0,
    dx: 0,
    dy: 0,
    get isScrolling() {
      return !!this.source;
    },
  });

  let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
  function handleScroll(next: Partial<ScrollPosition> & { source: HTMLElement }) {
    if (scrollEndTimeout) {
      clearTimeout(scrollEndTimeout);
    }

    scrollEndTimeout = setTimeout(() => {
      setScrollState((prev) => ({
        ...prev,
        source: undefined,
        dx: 0,
        dy: 0,
      }));
    }, 20);

    const state = scrollState();
    if (!state.source || next.source === state.source) {
      const dx = next.left !== undefined ? next.left - state.left : 0;
      const dy = next.top !== undefined ? next.top - state.top : 0;
      if (dx || dy) {
        setScrollState((prev) => ({
          ...prev,
          ...next,
          dx,
          dy,
        }));
      }
    }
  }

  const createScrollSetter = (direction?: Direction) => (el: HTMLElement) => {
    createEffect(() => {
      const state = scrollState();
      if (state.source && state.source !== el) {
        if (direction !== 'horizontal') {
          el.scrollTop = state.top;
        }
        if (direction !== 'vertical') {
          el.scrollLeft = state.left;
        }
      }
    });
  };

  const scrollHandlers: ScrollHandlers = (evt: Event) => {
    if (!evt.target) return;

    const source = evt.target as HTMLElement;
    handleScroll({
      source,
      left: source.scrollLeft,
      top: source.scrollTop,
    });
  };
  scrollHandlers.vertical = (evt) => {
    if (!evt.target) return;

    const source = evt.target as HTMLElement;
    handleScroll({
      source,
      top: source.scrollTop,
    });
  };
  scrollHandlers.horizontal = (evt) => {
    if (!evt.target) return;

    const source = evt.target as HTMLElement;
    handleScroll({
      source,
      left: source.scrollLeft,
    });
  };

  const scrollSetters = createScrollSetter() as ScrollSetters;
  scrollSetters.vertical = createScrollSetter('vertical');
  scrollSetters.horizontal = createScrollSetter('horizontal');

  return [scrollSetters, scrollHandlers, scrollState];
}
