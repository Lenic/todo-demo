/**
 * This is the client-side code that uses the inferred types from the server
 */
import { createTRPCClient, httpBatchLink } from '@trpc/client';
/**
 * We only import the `AppRouter` type from the server - this is not available at runtime
 */
import type { AppRouter } from './entrance';
import superjson from 'superjson';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      transformer: superjson,
    }),
  ],
});
