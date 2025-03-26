export const createContext = (opts: { req: Request }) => {
  const clientId = opts.req.headers.get('x-trpc-client') ?? '';

  return Promise.resolve({ clientId });
};

export type Context = Awaited<ReturnType<typeof createContext>>;
