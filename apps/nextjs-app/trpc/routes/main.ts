import { nanoid } from 'nanoid';
import { asyncScheduler, filter, observeOn } from 'rxjs';
import { eachValueFrom } from 'rxjs-for-await';

import { dataNotification } from '../notifications';
import { publicProcedure, router } from '../server';

import { todoRouter } from './todo';

const clientIds = new Set<string>();

export const appRouter = router({
  todo: todoRouter,
  sync: publicProcedure.subscription(async function* (opts) {
    let clientId = nanoid();
    opts.signal?.addEventListener('abort', () => clientIds.delete(clientId));

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
