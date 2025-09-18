import type { IChangedItemInfo, TItemChangedEvent } from './types';
import type { Session } from '@auth/core/types';

import Pusher from 'pusher';
import { from, map, of } from 'rxjs';

import { PUSHER_EVENT, SOCKET_ID_HEADER_KEY } from '~/constants';

const pusher = new Pusher({
  appId: process.env.NUXT_PUSHER_ID!,
  key: process.env.NUXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NUXT_PUSHER_SECRET!,
  cluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const publish = (headers: Headers | Readonly<Record<string, string>>, session: Session | null) => {
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('[Request Auth]: can not find the user id.');
  }

  let clientId = '';
  if (headers instanceof Headers) {
    clientId = headers.get(SOCKET_ID_HEADER_KEY) ?? '';
  } else {
    clientId = headers[SOCKET_ID_HEADER_KEY] ?? '';
  }

  return of({
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
  });
};

export const defineMethod =
  <T extends unknown[] = [], R = unknown>(fn: (tool$: ReturnType<typeof publish>, ...args: T) => R) =>
  (headers: Headers | Readonly<Record<string, string>>, session: Session | null) => {
    return (...args: T) => fn(publish(headers, session), ...args);
  };
