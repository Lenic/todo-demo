import { combineLatest, Subject } from 'rxjs';
import { onCleanup } from 'solid-js';

import { useObservableRef } from './observable-ref';

export function useScrollListener(immediate = true) {
  const [targetRef, target$] = useObservableRef<HTMLDivElement>();
  const [containerRef, container$] = useObservableRef<HTMLDivElement>();

  const entryTrigger = new Subject<IntersectionObserverEntry>();

  let previousEntries: IntersectionObserverEntry[] = [];
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    if (!entries.length) return;

    previousEntries = entries;
    entryTrigger.next(entries[0]);
  };

  let observer: IntersectionObserver | null = null;
  const handleCheck = () => {
    const currentEntries = observer?.takeRecords() ?? [];
    observerCallback(currentEntries.length ? currentEntries : previousEntries);
  };

  const subscription = combineLatest([container$, target$]).subscribe(([container, target]) => {
    if (observer) {
      previousEntries = [];
      observer.disconnect();
    }

    if (!container || !target) return;

    observer = new IntersectionObserver(observerCallback, {
      root: container,
      rootMargin: '0px',
      threshold: 0,
    });
    observer.observe(target);

    if (immediate) {
      handleCheck();
    }
  });

  onCleanup(() => {
    subscription.unsubscribe();
    observer?.disconnect();
  });

  const refs = { container: containerRef, target: targetRef, container$, target$ };
  return [refs, entryTrigger.asObservable(), handleCheck] as const;
}
