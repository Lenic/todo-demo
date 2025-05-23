import type { IChangedItemInfo, TItemChangedEvent } from './types';

import { headers } from 'next/headers';
import Pusher from 'pusher';
import { combineLatest, filter, from, map } from 'rxjs';

import { auth } from '@/auth';
import { PUSHER_EVENT, SOCKET_ID_HEADER_KEY } from '@/constants';

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export const publish = () =>
  combineLatest([
    from(auth()).pipe(
      map((session) => session?.user?.id ?? ''),
      filter((v) => !!v),
    ),
    from(headers()).pipe(map((store) => store.get(SOCKET_ID_HEADER_KEY) ?? '')),
  ]).pipe(
    map(([userId, clientId]) => ({
      userId,
      sync: <T>(data: TItemChangedEvent, result: T) => {
        if (!clientId) {
          throw new Error('[Request Headers]: can not find the client id.');
        }

        const v: IChangedItemInfo = { clientId, data };

        const waiter = pusher.trigger(userId, PUSHER_EVENT, v, { socket_id: clientId }).catch((e: unknown) => {
          console.log('[Pusher Error]: push new message error.', v, e);
        });

        return from(waiter).pipe(map(() => result));
      },
    })),
  );
