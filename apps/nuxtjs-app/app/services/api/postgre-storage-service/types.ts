import type { ICreatedItem, IItem } from '../types';
import type { ICreatedTodoItem, ITodoItem, ITodoListQueryArgs } from '@todo/interface';
import type { IDataStorageService } from '@todo/interface';

import { createIdentifier } from '@todo/container';

export interface IDBCreatedTodoItem extends ICreatedTodoItem, ICreatedItem {}

export interface IDBTodoItem extends ITodoItem, IItem {}

export interface IDBTodoListQueryArgs extends ITodoListQueryArgs {
  todyZero: number;
  userId: string;
}

export const IDBDataStorageService = createIdentifier<
  IDataStorageService<IDBCreatedTodoItem, IDBTodoItem, IDBTodoListQueryArgs>
>(Symbol('IDBDataStorageService'));
