'use client';

import '@/services/register-client';

import type { IChangedItemInfo, TItemChangedEvent } from '@/app/server/notifications';
import type { ELocaleType } from '@/i18n';

// eslint-disable-next-line import/named -- It's OK to use named imports here
import { useLocale, useTranslations } from 'next-intl';
import Pusher from 'pusher-js';
import { useEffect, useMemo } from 'react';
import {
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  firstValueFrom,
  Observable,
  ReplaySubject,
  shareReplay,
  switchMap,
} from 'rxjs';

import { PUSHER_EVENT } from '@/constants';

const socketIdSubject = new ReplaySubject<string>(1);
const localeSubject = new ReplaySubject<ELocaleType>(1);
const translationFormattingSubject = new ReplaySubject<ReturnType<typeof useTranslations>>(1);
const channelIdSubject = new ReplaySubject<string>(1);

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

// add socket id header to server actions
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (
      init?.headers instanceof Object &&
      'Accept' in init.headers &&
      init.headers.Accept === 'text/x-component' &&
      'Next-Action' in init.headers
    ) {
      const socketId = await firstValueFrom(socketIdSubject);
      return await originalFetch(input, {
        ...init,
        headers: { ...init.headers, 'Socket-Id': socketId },
      });
    }

    return await originalFetch(input, init);
  };
}

/**
 * user language changed notification
 */
export const language$ = localeSubject.pipe(distinctUntilChanged(), shareReplay(1));
/**
 * global i18n translation notification
 */
export const t$ = translationFormattingSubject.pipe(distinctUntilChanged(), shareReplay(1));

export interface IGlobalMonitorProps {
  channelId: string;
}

export const GlobalMonitor = ({ channelId }: IGlobalMonitorProps) => {
  useEffect(() => {
    channelIdSubject.next(channelId);
  }, [channelId]);

  const locale = useLocale();
  useEffect(() => {
    localeSubject.next(locale as ELocaleType);
  }, [locale]);

  const t = useTranslations();
  useMemo(() => {
    translationFormattingSubject.next(t);
  }, [t]);

  return null;
};
