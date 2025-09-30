import type { IChangedItemInfo, TItemChangedEvent } from './types';
import type { Session } from '@auth/core/types';

import Pusher from 'pusher';
import { catchError, from, map, of, throwError } from 'rxjs';

import { PUSHER_EVENT, SOCKET_ID_HEADER_KEY } from '~/constants';

const pusher = new Pusher({
  appId: process.env.NUXT_PUSHER_ID!,
  key: process.env.NUXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NUXT_PUSHER_SECRET!,
  cluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export function publish() {
  return of(null).pipe(
    map(() => useRequestEvent()),
    catchError(() => throwError(() => new Error('[Request Event]: can not find the event.'))),
    map((event) => {
      if (!event) {
        throw new Error('[Request Event]: can not find the event instance.');
      }

      const session = event.context.session as Session | null;
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error('[Request Auth]: can not find the user id.');
      }

      const clientId = event.headers.get(SOCKET_ID_HEADER_KEY) ?? '';
      return {
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
      };
    }),
  );
}
