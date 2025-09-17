import type { IChangedItemInfo, TItemChangedEvent } from './types';

import Pusher from 'pusher';
import { from, map, zip } from 'rxjs';

import { PUSHER_EVENT, SOCKET_ID_HEADER_KEY } from '~/constants';
import { useAuth } from '~/hooks/auth';

const pusher = new Pusher({
  appId: process.env.NUXT_PUSHER_ID!,
  key: process.env.NUXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NUXT_PUSHER_SECRET!,
  cluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export const publish = () => {
  return zip([
    getHookValue<string>((observer) => {
      const { session } = useAuth();
      const userId = session.value?.user?.id;
      if (!userId) {
        throw new Error('[Request Auth]: can not find the user id.');
      }

      observer.next(userId);
      observer.complete();
    }),
    getHookValue<string>((observer) => {
      const headers = useRequestHeaders();

      observer.next(headers[SOCKET_ID_HEADER_KEY] ?? '');
      observer.complete();
    }),
  ]).pipe(
    map(([userId, clientId]) => ({
      userId,
      sync: <T>(data: TItemChangedEvent, result: T) => {
        if (!clientId) {
          throw new Error('[Request Headers]: can not find the client id.');
        }

        const params: IChangedItemInfo = { clientId, data };
        const waiter = pusher.trigger(userId, PUSHER_EVENT, params, { socket_id: clientId }).catch((e: unknown) => {
          console.log('[Pusher Error]: push new message error.', params, e);
        });

        return from(waiter).pipe(map(() => result));
      },
    })),
  );
};
