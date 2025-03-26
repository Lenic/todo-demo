import type { AppRouter } from './routes';
import type { TItemChangedEvent } from '@/services';

import { createTRPCClient, httpBatchLink, splitLink, unstable_httpSubscriptionLink } from '@trpc/client';
import { Observable, share } from 'rxjs';
import superjson from 'superjson';

let clientId = '';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      // uses the httpSubscriptionLink for subscriptions
      condition: (op) => op.type === 'subscription',
      true: unstable_httpSubscriptionLink({
        url: `/api/trpc`,
        transformer: superjson,
      }),
      false: httpBatchLink({
        url: `/api/trpc`,
        transformer: superjson,
        headers: () => ({ 'x-trpc-client': clientId }),
      }),
    }),
  ],
});

export const message$ = new Observable<string | TItemChangedEvent>((observer) => {
  const subscription = trpc.sync.subscribe(void 0, {
    onData: (clientIdOrItem) => {
      if (typeof clientIdOrItem === 'string') {
        console.log('Connected Id:', clientIdOrItem);
        clientId = clientIdOrItem;
      } else {
        observer.next(clientIdOrItem);
      }
    },
    onError: (err) => {
      observer.error(err);
    },
    onComplete: () => {
      clientId = '';
      observer.complete();
    },
  });
  return () => {
    subscription.unsubscribe();
  };
}).pipe(share());
