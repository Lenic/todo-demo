import type { Session } from '@auth/core/types';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export interface ITRPCContext extends FetchCreateContextFnOptions {
  headers: Headers;
  session: Session | null;
}
