'use server';

import type { ICreatedTodoItem, ITodoItem, ITodoListQueryArgs } from '@todo/interface';

import { ServiceLocator } from '@todo/container';
import { IDataStorageService } from '@todo/interface';
import { combineLatest, firstValueFrom, map, tap } from 'rxjs';

import { publish } from './notifications';

export async function queryTodoList(args: ITodoListQueryArgs) {
  const list$ = ServiceLocator.default.get(IDataStorageService).query(args);

  return firstValueFrom(list$);
}

export async function addTodoItem(partialItem: ICreatedTodoItem) {
  const item$ = combineLatest([ServiceLocator.default.get(IDataStorageService).add(partialItem), publish()]).pipe(
    tap(([item, fn]) => {
      fn({ type: 'add-todo', item });
    }),
    map((v) => v[0]),
  );

  return firstValueFrom(item$);
}

export async function updateTodoItem(wholeItem: ITodoItem) {
  const item$ = combineLatest([ServiceLocator.default.get(IDataStorageService).update(wholeItem), publish()]).pipe(
    tap(([item, fn]) => {
      fn({ type: 'update-todo', item });
    }),
    map((v) => v[0]),
  );

  return firstValueFrom(item$);
}

export async function deleteTodoItem(id: string) {
  const item$ = combineLatest([ServiceLocator.default.get(IDataStorageService).delete(id), publish()]).pipe(
    tap(([, fn]) => {
      fn({ type: 'delete-todo', id });
    }),
    map(() => void 0),
  );

  return firstValueFrom(item$);
}
