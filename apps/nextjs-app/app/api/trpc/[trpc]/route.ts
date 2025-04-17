import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { createContext } from '@/trpc/context';
import { appRouter } from '@/trpc/routes';

const handler = (req: Request) =>
  fetchRequestHandler({
    req,
    createContext,
    router: appRouter,
    endpoint: '/api/trpc',
    onError: ({ error }) => {
      console.error('[tRPC Error]:', error);
    },
    allowBatching: true,
  });

export { handler as GET, handler as POST };
