import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/trpc/routes';
import { createTRPCContext } from '@/trpc/server';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ error }) => {
      console.error('tRPC Error:', error); // 查看具体错误堆栈
    },
  });

export { handler as GET, handler as POST };
