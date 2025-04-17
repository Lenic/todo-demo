import { ServiceLocator } from '@todo/container';
import { IDataStorageService } from '@todo/interface';
import { firstValueFrom, tap } from 'rxjs';
import { z } from 'zod';

import { publicProcedure, router, updateProcedure } from '../../server';

import { addTodoItemArgs, queryTodoArgs, updateTodoItemArgs } from './zod';

const getService = () => ServiceLocator.default.get(IDataStorageService);

export const todoRouter = router({
  list: publicProcedure.input(queryTodoArgs).query(({ input }) => firstValueFrom(getService().query(input))),
  add: updateProcedure.input(addTodoItemArgs).mutation(({ input, ctx }) =>
    firstValueFrom(
      getService()
        .add(input)
        .pipe(
          tap((item) => {
            ctx.broadcast({ type: 'add-todo', item });
          }),
        ),
    ),
  ),
  update: updateProcedure.input(updateTodoItemArgs).mutation(({ input, ctx }) =>
    firstValueFrom(
      getService()
        .update(input)
        .pipe(
          tap((item) => {
            ctx.broadcast({ type: 'update-todo', item });
          }),
        ),
    ),
  ),
  delete: updateProcedure.input(z.string()).mutation(({ input, ctx }) =>
    firstValueFrom(
      getService()
        .delete(input)
        .pipe(
          tap(() => {
            ctx.broadcast({ type: 'delete-todo', id: input });
          }),
        ),
    ),
  ),
});

export type TodoRouter = typeof todoRouter;
