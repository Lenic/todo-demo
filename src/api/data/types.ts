import type { Observable } from 'rxjs';

import { createIdentifier } from '@/lib/injector';

export enum ETodoStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface ITodoItem {
  id: string;
  title: string;
  overdueAt?: number;
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

  add(item: Omit<ITodoItem, 'id' | 'createdAt' | 'updatedAt'>): Observable<ITodoItem>;
  update(item: ITodoItem): Observable<ITodoItem>;
  delete(id: string): Observable<void>;
}
export const IDataStorageService = createIdentifier<IDataStorageService>(Symbol('IDataStorageService'));
