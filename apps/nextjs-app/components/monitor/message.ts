import type { IChangedItemInfo, TItemChangedEvent } from '@/app/server/notifications';

import Pusher from 'pusher-js';
import { combineLatest, EMPTY, Observable, shareReplay, switchMap } from 'rxjs';

import { PUSHER_EVENT } from '@/constants';

import { channelIdSubject, socketIdSubject } from './constants';

// Pusher.logToConsole = true;
export const message$ = combineLatest([
  channelIdSubject,
  new Observable<Pusher>((observer) => {
    if (typeof window === 'undefined') return;
    observer.next(
      new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      }),
    );
    observer.complete();
  }),
]).pipe(
  switchMap(([channelId, pusher]) => {
    if (!channelId) return EMPTY;

    return new Observable<TItemChangedEvent>((observer) => {
      let clientId = '';
      const manager = pusher.connection.bind('connected', () => {
        clientId = pusher.connection.socket_id;
        socketIdSubject.next(clientId);
      });

      const channel = pusher.subscribe(channelId).bind(PUSHER_EVENT, (info: IChangedItemInfo) => {
        if (clientId === info.clientId) return;

        observer.next(info.data);
      });

      return () => {
        manager.unbind_all();
        manager.disconnect();

        channel.unbind_all();
        channel.cancelSubscription();
        channel.disconnect();

        pusher.unsubscribe(channelId);
        pusher.disconnect();
      };
    });
  }),
  shareReplay(1),
);
