import { ETodoListType, ETodoStatus } from '@todo/interface';
import { z } from 'zod';

export const queryTodoArgs = z.object({
  offset: z.number().min(0).default(0),
  limit: z.number().min(5).max(30).default(10),
  type: z.nativeEnum(ETodoListType).default(ETodoListType.PENDING),
});

export const addTodoItemArgs = z.object({
  title: z.string().max(255),
  overdueAt: z.union([z.number(), z.undefined()]),
});

export const updateTodoItemArgs = addTodoItemArgs.extend({
  id: z.string(),
  description: z.union([z.string(), z.undefined()]),
  createdAt: z.number(),
  status: z.nativeEnum(ETodoStatus),
  updatedAt: z.number(),
});
