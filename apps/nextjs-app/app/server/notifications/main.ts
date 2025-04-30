import type { IChangedItemInfo, TItemChangedEvent } from './types';

import { headers } from 'next/headers';
import Pusher from 'pusher';
import { combineLatest, filter, from, map } from 'rxjs';

import { auth } from '@/auth';
import { PUSHER_EVENT } from '@/constants';

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
      map((session) => session?.user?.email ?? ''),
      filter((v) => !!v),
    ),
    from(headers()).pipe(
      map((store) => {
        const clientId = store.get('Socket-Id') ?? '';
        if (!clientId) {
          throw new Error('[Request Headers]: can not find the client id.');
        }
        return clientId;
      }),
    ),
  ]).pipe(
    map(([channelId, clientId]) => <T>(data: TItemChangedEvent, result: T) => {
      const v: IChangedItemInfo = { clientId, data };

      const waiter = pusher.trigger(channelId, PUSHER_EVENT, v, { socket_id: clientId }).catch((e: unknown) => {
        console.log('[Pusher Error]: push new message error.', v, e);
      });

      return from(waiter).pipe(map(() => result));
    }),
  );
