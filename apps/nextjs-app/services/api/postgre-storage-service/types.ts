import type { ICreatedItem, IItem } from '../types';
import type { ICreatedTodoItem, ITodoItem } from '@todo/interface';
import type { IDataStorageService } from '@todo/interface';

import { createIdentifier } from '@todo/container';

export interface IDBCreatedTodoItem extends ICreatedTodoItem, ICreatedItem {}

export interface IDBTodoItem extends ITodoItem, IItem {}

export const IDBDataStorageService = createIdentifier<IDataStorageService<IDBCreatedTodoItem, IDBTodoItem>>(
  Symbol('IDBDataStorageService'),
);
