import { ServiceLocator } from '@todo/container';
import { ETodoListType, ETodoStatus } from '@todo/interface';
import { concatMap, firstValueFrom } from 'rxjs';
import { z } from 'zod';

import { IDBDataStorageService } from '@/services/api';

import { procedure, router } from './core';
import { publish } from './notifications';

const getService = () => ServiceLocator.default.get(IDBDataStorageService);

const queryTodoParams = z.object({
  type: z.enum(ETodoListType),
  offset: z.int().min(0),
  limit: z.int().min(1),
  todyZero: z.int().min(1759306887233),
});

const createdTodo = z.object({ title: z.string().min(1), overdueAt: z.int().min(1).optional() });

const wholeTodo = createdTodo.extend({
  id: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.int().min(1),
  status: z.enum(ETodoStatus),
  updatedAt: z.int().min(1),
  createdBy: z.string().min(1),
  updatedBy: z.string().min(1),
});

export const todo = router({
  queryTodoList: procedure
    .input(queryTodoParams)
    .query(({ input }) =>
      firstValueFrom(publish().pipe(concatMap(({ userId }) => getService().query({ ...input, userId })))),
    ),
  addTodoItem: procedure.input(createdTodo).mutation(({ input }) =>
    firstValueFrom(
      publish().pipe(
        concatMap(({ userId, sync }) =>
          getService()
            .add({ ...input, createdBy: userId, updatedBy: userId })
            .pipe(concatMap((item) => sync({ type: 'add-todo', item }, item))),
        ),
      ),
    ),
  ),
  updateTodoItem: procedure.input(wholeTodo).mutation(({ input }) =>
    firstValueFrom(
      publish().pipe(
        concatMap(({ userId, sync }) =>
          getService()
            .update({ ...input, updatedBy: userId })
            .pipe(concatMap((item) => sync({ type: 'update-todo', item }, item))),
        ),
      ),
    ),
  ),
  deleteTodoItem: procedure.input(z.string().min(1)).mutation(({ input }) =>
    firstValueFrom(
      publish().pipe(
        concatMap(({ sync }) =>
          getService()
            .delete(input)
            .pipe(concatMap(() => sync({ type: 'delete-todo', id: input }, void 0))),
        ),
      ),
    ),
  ),
});
