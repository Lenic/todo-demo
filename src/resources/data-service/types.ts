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

export interface IDataService {
  dataMapper: Record<string, ITodoItem>;
  dataMapper$: Observable<Record<string, ITodoItem>>;

  planningList$: Observable<string[]>;
  overdueList$: Observable<string[]>;
  archiveList$: Observable<string[]>;

  append(list: ITodoItem[]): void;
  addOrUpdate(item: ITodoItem): void;
  delete(id?: string): void;
}

export const IDataService = createIdentifier<IDataService>(Symbol('IDataService'));
