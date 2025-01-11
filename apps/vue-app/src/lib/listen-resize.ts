import type { Ref, ShallowRef, WatchHandle } from 'vue';

import { Observable } from 'rxjs';
import { effectScope, isRef, watch } from 'vue';

function listenRefResize$(elRef: Ref<HTMLElement | undefined> | ShallowRef<HTMLElement | undefined>) {
  return new Observable<[number, number]>((observer) => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length) {
        const entry = entries[0];
        observer.next([entry.contentRect.width, entry.contentRect.height]);
      }
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

function listenElementResize$(el: HTMLElement | undefined) {
  return new Observable<[number, number]>((observer) => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length) {
        const entry = entries[0];
        observer.next([entry.contentRect.width, entry.contentRect.height]);
      }
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
  elRef: Ref<HTMLElement | undefined> | ShallowRef<HTMLElement | undefined> | HTMLElement | undefined,
) {
  if (isRef(elRef)) {
    return listenRefResize$(elRef);
  } else {
    return listenElementResize$(elRef);
  }
}
