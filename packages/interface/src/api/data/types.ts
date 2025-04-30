import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export enum ETodoStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface ICreatedTodoItem {
  title: string;
  overdueAt?: number;
}

export interface ITodoItem extends ICreatedTodoItem {
  id: string;
  description?: string;
  createdAt: number;
  status: ETodoStatus;
  updatedAt: number;
}

export enum ETodoListType {
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  ARCHIVE = 'ARCHIVE',
}

export interface ITodoListQueryArgs {
  type: ETodoListType;
  offset: number;
  limit: number;
}

export interface IDataStorageService<
  TCreatedItem extends ICreatedTodoItem = ICreatedTodoItem,
  IItem extends ITodoItem = ITodoItem,
> {
  query(args: ITodoListQueryArgs): Observable<IItem[]>;

  add(item: TCreatedItem): Observable<IItem>;
  update(item: IItem): Observable<IItem>;
  delete(id: string): Observable<void>;
}
export const IDataStorageService = createIdentifier<IDataStorageService>(Symbol('IDataStorageService'));
