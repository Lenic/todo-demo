import '@/services';

import { ServiceLocator } from '@todo/container';
import { IDataStorageService } from '@todo/controllers';
import { firstValueFrom, tap } from 'rxjs';
import { z } from 'zod';

import { publicProcedure, router } from '../../server';
import { dataNotification } from '../notifications';

import { addTodoItemArgs, queryTodoArgs, updateTodoItemArgs } from './zod';

const storageService = ServiceLocator.default.get(IDataStorageService);

export const todoRouter = router({
  list: publicProcedure.input(queryTodoArgs).query(({ input }) => firstValueFrom(storageService.query(input))),
  add: publicProcedure.input(addTodoItemArgs).mutation(({ input, ctx }) =>
    firstValueFrom(
      storageService.add(input).pipe(
        tap((item) => {
          dataNotification.next({ clientId: ctx.clientId, data: { type: 'add-todo', item } });
        }),
      ),
    ),
  ),
  update: publicProcedure.input(updateTodoItemArgs).mutation(({ input, ctx }) =>
    firstValueFrom(
      storageService.update(input).pipe(
        tap((item) => {
          dataNotification.next({ clientId: ctx.clientId, data: { type: 'update-todo', item } });
        }),
      ),
    ),
  ),
  delete: publicProcedure.input(z.string()).mutation(({ input, ctx }) =>
    firstValueFrom(
      storageService.delete(input).pipe(
        tap(() => {
          dataNotification.next({ clientId: ctx.clientId, data: { type: 'delete-todo', id: input } });
        }),
      ),
    ),
  ),
});

export type TodoRouter = typeof todoRouter;
