import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ServiceLocator } from '@todo/container';
import { ISystemDictionaryService } from '#shared/services/api';

const t = initTRPC.create();

const service = ServiceLocator.default.get(ISystemDictionaryService);

export const userRouter = t.router({
  getById: t.procedure.input(z.object({ id: z.string() })).query(({ input }) => {
    return service.getById(input.id);
  }),
});
