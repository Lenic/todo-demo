import type { IChangedItemInfo, TItemChangedEvent } from './types';

import { cookies } from 'next/headers';
import { from, map, Subject } from 'rxjs';

export const dataNotification = new Subject<IChangedItemInfo>();

// dataNotification.subscribe((v) => {
//   console.log('broadcast item changed:', v);
// });

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
