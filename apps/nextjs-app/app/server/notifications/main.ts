import type { IChangedItemInfo, TItemChangedEvent } from './types';

import { cookies } from 'next/headers';
import Pusher from 'pusher';
import { from, map, Subject } from 'rxjs';

export const dataNotification = new Subject<IChangedItemInfo>();

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

dataNotification.subscribe((v) => {
  const key = process.env.NEXT_PUBLIC_PUSHER_CHANNEL;
  console.log(
    '[Pusher Info]: push new message',
    v,
    process.env.PUSHER_ID,
    process.env.NEXT_PUBLIC_PUSHER_KEY,
    process.env.PUSHER_SECRET,
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  );
  pusher.trigger(key, key, v).then(
    (res) => {
      console.log('[Pusher Result]: push new message result', res);
    },
    (e: unknown) => {
      console.log('[Pusher Error]: push new message error.', v, e);
    },
  );
});

export const publish = () =>
  from(cookies()).pipe(
    map((store) => {
      const clientId = store.get('clientId')?.value ?? '';
      if (!clientId) {
        throw new Error('[Cookie]: can not find the client id.');
      }

      return (data: TItemChangedEvent) => {
        dataNotification.next({ clientId, data });
      };
    }),
  );
