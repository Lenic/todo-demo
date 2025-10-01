import type { Observable, Subscription } from 'rxjs';

import { onBeforeUnmount } from 'vue';

export function useObservableEffect<T>(subscriptionOrObservable: Subscription | Observable<T>) {
  const subscription =
    'subscribe' in subscriptionOrObservable ? subscriptionOrObservable.subscribe() : subscriptionOrObservable;

  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });
}
