import type { AppRouter } from './entrance';

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { firstValueFrom, map } from 'rxjs';
import superjson from 'superjson';

import { socketIdSubject } from '~/components/monitor';
import { SOCKET_ID_HEADER_KEY } from '~/constants';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
      headers: () => firstValueFrom(socketIdSubject.pipe(map((id) => ({ [SOCKET_ID_HEADER_KEY]: id })))),
    }),
  ],
});
