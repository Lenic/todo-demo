import type { Subscription } from 'rxjs';

import { onCleanup } from 'solid-js';

export function useObservableEffect(subscription: Subscription) {
  onCleanup(() => {
    subscription.unsubscribe();
  });
}
