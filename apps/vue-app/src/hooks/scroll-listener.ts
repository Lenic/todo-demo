import { combineLatest, filter, Subject } from 'rxjs';
import { onBeforeUnmount, ref } from 'vue';

import { useObservableEffect } from './observable-effect';
import { useObservableWatch } from './observable-watch';

export function useScrollListener(immediate = true) {
  const containerRef = ref<HTMLDivElement>();
  const container$ = useObservableWatch(containerRef);

  const targetRef = ref<HTMLDivElement>();
  const target$ = useObservableWatch(targetRef);

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

  useObservableEffect(
    combineLatest([container$.pipe(filter((v) => !!v)), target$.pipe(filter((v) => !!v))]).subscribe(
      ([container, target]) => {
        if (observer) {
          observer.disconnect();
        }

        observer = new IntersectionObserver(observerCallback, {
          root: container,
          rootMargin: '0px',
          threshold: 0,
        });
        observer.observe(target);

        if (immediate) {
          handleCheck();
        }
      },
    ),
  );

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  const refs = { container: containerRef, target: targetRef };
  return [refs, entryTrigger.asObservable(), handleCheck] as const;
}
