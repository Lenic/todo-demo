import type { IChangedItemInfo, TItemChangedEvent } from './types';

import { useRequestHeaders } from 'nuxt/app';
// import { headers } from 'next/headers';
// import Pusher from 'pusher';
import { map, of, zip } from 'rxjs';

import { SOCKET_ID_HEADER_KEY } from '../../constants';

// const pusher = new Pusher({
//   appId: process.env.PUSHER_ID,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY,
//   secret: process.env.PUSHER_SECRET,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
//   useTLS: true,
// });

export const publish = () => {
  const headers = useRequestHeaders();
  return zip([
    of(headers).pipe(
      map((headers) => {
        console.log('headers length', Object.keys(headers).length);
        return '7224a0ad-af31-4c71-81ed-7d3ef0a9423d';
      }),
    ),
    of(headers).pipe(map((store) => store[SOCKET_ID_HEADER_KEY] ?? '')),
  ]).pipe(
    map(([userId, clientId]) => ({
      userId,
      sync: <T>(data: TItemChangedEvent, result: T) => {
        if (!clientId) {
          throw new Error('[Request Headers]: can not find the client id.');
        }

        const v: IChangedItemInfo = { clientId, data };

        // const waiter = pusher.trigger(userId, PUSHER_EVENT, v, { socket_id: clientId }).catch((e: unknown) => {
        //   console.log('[Pusher Error]: push new message error.', v, e);
        // });
        //
        // return from(waiter).pipe(map(() => result));

        return of(result);
      },
    })),
  );
};
