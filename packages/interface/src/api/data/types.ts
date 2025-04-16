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

export interface IDataStorageService {
  query(args: ITodoListQueryArgs): Observable<ITodoItem[]>;

  add(item: ICreatedTodoItem): Observable<ITodoItem>;
  update(item: ITodoItem): Observable<ITodoItem>;
  delete(id: string): Observable<void>;
}
export const IDataStorageService = createIdentifier<IDataStorageService>(Symbol('IDataStorageService'));
