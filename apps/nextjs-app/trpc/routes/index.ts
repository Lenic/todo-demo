import { nanoid } from 'nanoid';
import { asyncScheduler, observeOn } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';

import { dataNotification } from '@/services';

import { publicProcedure, router } from '../server';

import { todoRouter } from './todo';

const clientIds = new Set<string>();

export const appRouter = router({
  todo: todoRouter,
  sync: publicProcedure.subscription(async function* (opts) {
    opts.signal?.addEventListener('abort', () => clientIds.delete(clientId));

    let clientId = nanoid();
    while (clientIds.has(clientId)) {
      clientId = nanoid();
    }
    clientIds.add(clientId);
    yield clientId;

    for await (const item of eachValueFrom(dataNotification.pipe(observeOn(asyncScheduler, 100)))) {
      yield item;
    }
  }),
});

export type AppRouter = typeof appRouter;
