import type { ETodoListType, ITodoItem } from '@/api';
import type { Observable } from 'rxjs';

import { createIdentifier } from '@/lib/injector';

export interface IDataService {
  dataMapper: Record<string, ITodoItem>;
  dataMapper$: Observable<Record<string, ITodoItem>>;

  planningList: string[];
  overdueList: string[];
  archiveList: string[];

  planningList$: Observable<string[]>;
  overdueList$: Observable<string[]>;
  archiveList$: Observable<string[]>;

  ends: Record<ETodoListType, boolean>;
  ends$: Observable<Record<ETodoListType, boolean>>;

  loading$: Observable<Record<ETodoListType, boolean>>;
  loading: Record<ETodoListType, boolean>;

  loadMore(type: ETodoListType): Observable<void>;

  append(list: ITodoItem[]): void;
  add(item: Omit<ITodoItem, 'id' | 'createdAt' | 'updatedAt'>): void;
  update(item: ITodoItem): void;
  delete(id?: string): void;
}

export const IDataService = createIdentifier<IDataService>(Symbol('IDataService'));
