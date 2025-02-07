import type { Subscribable, Subscription } from 'rxjs';

import { onCleanup } from 'solid-js';

export function useObservableEffect(subscription: Subscription): void;
export function useObservableEffect<T>(subscribable: Subscribable<T>): void;

export function useObservableEffect<T>(value: Subscription | Subscribable<T>) {
  if ('subscribe' in value) {
    const subscription = value.subscribe({});
    onCleanup(() => {
      subscription.unsubscribe();
    });
  } else {
    onCleanup(() => {
      value.unsubscribe();
    });
  }
}
