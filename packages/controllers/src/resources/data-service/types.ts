import type { ETodoListType, ICreatedTodoItem, ITodoItem } from '@/api';
import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export interface IDataService {
  dataMapper: Record<string, ITodoItem>;
  dataMapper$: Observable<Record<string, ITodoItem>>;

  ids: Record<ETodoListType, string[]>;
  ids$: Observable<Record<ETodoListType, string[]>>;

  ends: Record<ETodoListType, boolean>;
  ends$: Observable<Record<ETodoListType, boolean>>;

  loading$: Observable<Record<ETodoListType, boolean>>;
  loading: Record<ETodoListType, boolean>;

  loadMore(type: ETodoListType): Observable<void>;

  append(list: ITodoItem[]): void;
  add(item: ICreatedTodoItem): Promise<ITodoItem>;
  update(item: ITodoItem): Promise<ITodoItem>;
  delete(id?: string): Promise<void>;
}

export const IDataService = createIdentifier<IDataService>(Symbol('IDataService'));
