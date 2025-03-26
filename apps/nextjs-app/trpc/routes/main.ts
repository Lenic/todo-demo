import { nanoid } from 'nanoid';
import { asyncScheduler, filter, observeOn } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';

import { publicProcedure, router } from '../server';

import { dataNotification } from './notifications';
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

    const data$ = dataNotification.pipe(
      observeOn(asyncScheduler, 100),
      filter((v) => v.clientId !== clientId),
    );

    for await (const item of eachValueFrom(data$)) {
      yield item;
    }
  }),
});

export type AppRouter = typeof appRouter;
