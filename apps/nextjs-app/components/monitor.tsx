'use client';

import type { IChangedItemInfo, TItemChangedEvent } from '@/app/server/notifications';
import type { ELocaleType } from '@/i18n';

// eslint-disable-next-line import/named -- It's OK to use named imports here
import { useLocale, useTranslations } from 'next-intl';
import Pusher from 'pusher-js';
import { useEffect, useMemo } from 'react';
import { distinctUntilChanged, filter, from, map, Observable, ReplaySubject, shareReplay, switchMap } from 'rxjs';

import { initialize } from '@/services/register-client';

const localeSubject = new ReplaySubject<ELocaleType>(1);
const translationFormattingSubject = new ReplaySubject<ReturnType<typeof useTranslations>>(1);

// Pusher.logToConsole = true;
export const message$ = from(typeof window === 'undefined' ? '' : document.cookie.split(';')).pipe(
  filter((v) => v.startsWith('clientId=')),
  map((v) => v.split('=')[1]),
  filter((v) => !!v),
  switchMap(
    (clientId) =>
      new Observable<TItemChangedEvent>((observer) => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster: 'ap3' });

        const key = process.env.NEXT_PUBLIC_PUSHER_CHANNEL;
        const channel = pusher.subscribe(key).bind(key, (info: IChangedItemInfo) => {
          console.log(clientId, info);
          if (clientId === info.clientId) return;

          observer.next(info.data);
        });

        return () => {
          channel.cancelSubscription();

          pusher.unsubscribe(key);
          pusher.disconnect();
        };
      }),
  ),
  shareReplay(1),
);

/**
 * user language changed notification
 */
export const language$ = localeSubject.pipe(distinctUntilChanged(), shareReplay(1));
/**
 * global
 */
export const t$ = translationFormattingSubject.pipe(distinctUntilChanged(), shareReplay(1));

export const GlobalMonitor = () => {
  initialize();

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
