import type { Subscribable, Subscription } from 'rxjs';

import { onCleanup } from 'solid-js';

export function useObservableEffect<T>(...list: (Subscription | Subscribable<T>)[]) {
  const subscriptions = list.map((value) => {
    if ('subscribe' in value) {
      return value.subscribe({});
    } else {
      return value;
    }
  });

  onCleanup(() => {
    subscriptions.forEach((v) => {
      v.unsubscribe();
    });
  });
}
