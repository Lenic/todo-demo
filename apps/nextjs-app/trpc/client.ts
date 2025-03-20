import type { AppRouter } from './routes';

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
      headers() {
        return { 'x-trpc-source': 'client' };
      },
    }),
  ],
});
