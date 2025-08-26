import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter, createContext } from '~/trpc';

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const url = getRequestURL(event);
  const body = await readRawBody(event);

  const headers = Object.entries(req.headers).reduce<[string, string][]>((acc, [key, value]) => {
    if (!value) return acc;
    else if (typeof value === 'string') {
      acc.push([key, value]);
    } else {
      value.forEach((item) => acc.push([key, item]));
    }
    return acc;
  }, []);

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: new Request(url, {
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? body : void 0,
      method: req.method,
    }),
    router: appRouter,
    createContext,
  });
});
