import type { Ref, ShallowRef, WatchHandle } from 'vue';

import { Observable } from 'rxjs';
import { effectScope, isRef, watch } from 'vue';

function listenRefResize$(elRef: Ref<HTMLDivElement | undefined> | ShallowRef<HTMLDivElement | undefined>) {
  return new Observable<ResizeObserverEntry[]>((observer) => {
    const resizeObserver = new ResizeObserver((entries) => {
      observer.next(entries);
    });

    const scope = effectScope(true);
    let watchHandler: WatchHandle | null = null;
    scope.run(() => {
      watchHandler = watch(
        elRef,
        (el) => {
          resizeObserver.disconnect();

          if (el) {
            resizeObserver.observe(el);
          }
        },
        { immediate: true },
      );

      return () => {
        watchHandler?.stop();
      };
    });

    return () => {
      scope.stop();
      resizeObserver.disconnect();
    };
  });
}

function listenElementResize$(el: HTMLDivElement | undefined) {
  return new Observable<ResizeObserverEntry[]>((observer) => {
    const resizeObserver = new ResizeObserver((entries) => {
      observer.next(entries);
    });

    if (el) {
      resizeObserver.observe(el);
    }

    return () => {
      observer.complete();
      resizeObserver.disconnect();
    };
  });
}

export function listenResize$(
  elRef: Ref<HTMLDivElement | undefined> | ShallowRef<HTMLDivElement | undefined> | HTMLDivElement | undefined,
) {
  if (isRef(elRef)) {
    return listenRefResize$(elRef);
  } else {
    return listenElementResize$(elRef);
  }
}
