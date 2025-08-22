import type { Subscription } from 'rxjs';

import { onBeforeUnmount } from 'vue';

export function useObservableEffect(subscription: Subscription) {
  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });
}
