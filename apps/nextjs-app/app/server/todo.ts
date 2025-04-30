'use server';

import type { IDBCreatedTodoItem, IDBTodoItem } from '@/services/api';
import type { ITodoListQueryArgs } from '@todo/interface';

import { ServiceLocator } from '@todo/container';
import { concatMap, firstValueFrom } from 'rxjs';

import { IDBDataStorageService } from '@/services/api';

import { publish } from './notifications';

const getService = () => ServiceLocator.default.get(IDBDataStorageService);

export async function queryTodoList(args: ITodoListQueryArgs) {
  const list$ = getService().query(args);

  return firstValueFrom(list$);
}

export async function addTodoItem(partialItem: IDBCreatedTodoItem) {
  const item$ = publish().pipe(
    concatMap(({ userId, sync }) =>
      getService()
        .add({ ...partialItem, createdBy: userId, updatedBy: userId })
        .pipe(concatMap((item) => sync({ type: 'add-todo', item }, item))),
    ),
  );

  return firstValueFrom(item$);
}

export async function updateTodoItem(wholeItem: IDBTodoItem) {
  const item$ = publish().pipe(
    concatMap(({ userId, sync }) =>
      getService()
        .update({ ...wholeItem, updatedBy: userId })
        .pipe(concatMap((item) => sync({ type: 'update-todo', item }, item))),
    ),
  );

  return firstValueFrom(item$);
}

export async function deleteTodoItem(id: string) {
  const res$ = publish().pipe(
    concatMap(({ sync }) =>
      getService()
        .delete(id)
        .pipe(concatMap(() => sync({ type: 'delete-todo', id }, void 0))),
    ),
  );

  return firstValueFrom(res$);
}
