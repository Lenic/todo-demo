import '../../services';

import { ServiceLocator } from '@todo/container';
import { ETodoListType, IDataStorageService } from '@todo/controllers';
import { firstValueFrom } from 'rxjs';

import { publicProcedure, router } from '../server';

const storageService = ServiceLocator.default.get(IDataStorageService);

export const appRouter = router({
  getUser: publicProcedure.query(() =>
    firstValueFrom(
      storageService.query({
        limit: 10,
        offset: 0,
        type: ETodoListType.PENDING,
      }),
    ),
  ),
});

export type AppRouter = typeof appRouter;
