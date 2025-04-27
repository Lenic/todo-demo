'use server';

import type { ICreatedTodoItem, ITodoItem, ITodoListQueryArgs } from '@todo/interface';

import { ServiceLocator } from '@todo/container';
import { IDataStorageService } from '@todo/interface';
import { combineLatest, concatMap, firstValueFrom } from 'rxjs';

import { publish } from './notifications';

const getService = () => ServiceLocator.default.get(IDataStorageService);

export async function queryTodoList(args: ITodoListQueryArgs) {
  const list$ = getService().query(args);

  return firstValueFrom(list$);
}

export async function addTodoItem(partialItem: ICreatedTodoItem) {
  const item$ = combineLatest([getService().add(partialItem), publish()]).pipe(
    concatMap(([item, fn]) => fn({ type: 'add-todo', item }, item)),
  );

  return firstValueFrom(item$);
}

export async function updateTodoItem(wholeItem: ITodoItem) {
  const item$ = combineLatest([getService().update(wholeItem), publish()]).pipe(
    concatMap(([item, fn]) => fn({ type: 'update-todo', item }, item)),
  );

  return firstValueFrom(item$);
}

export async function deleteTodoItem(id: string) {
  const item$ = combineLatest([getService().delete(id), publish()]).pipe(
    concatMap(([, fn]) => fn({ type: 'delete-todo', id }, void 0)),
  );

  return firstValueFrom(item$);
}
