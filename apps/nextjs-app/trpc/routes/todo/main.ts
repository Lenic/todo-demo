import '@/services';

import { ServiceLocator } from '@todo/container';
import { ETodoListType, ETodoStatus, IDataStorageService } from '@todo/controllers';
import { firstValueFrom } from 'rxjs';
import { z } from 'zod';

import { publicProcedure, router } from '../../server';
import { queryTodoArgs, addTodoItemArgs, updateTodoItemArgs } from './zod';

const storageService = ServiceLocator.default.get(IDataStorageService);

export const todoRouter = router({
  list: publicProcedure.input(queryTodoArgs).query(({ input }) => firstValueFrom(storageService.query(input))),
  add: publicProcedure.input(addTodoItemArgs).mutation(({ input }) => firstValueFrom(storageService.add(input))),
  update: publicProcedure
    .input(updateTodoItemArgs)
    .mutation(({ input }) => firstValueFrom(storageService.update(input))),
  delete: publicProcedure.input(z.string()).mutation(({ input }) => firstValueFrom(storageService.delete(input))),
});

export type TodoRouter = typeof todoRouter;
