import type { ETodoListType, ICreatedTodoItem, ITodoItem } from '../../api';
import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export interface IDataService<IItem extends ITodoItem = ITodoItem> {
  dataMapper: Record<string, IItem>;
  dataMapper$: Observable<Record<string, IItem>>;

  ids: Record<ETodoListType, string[]>;
  ids$: Observable<Record<ETodoListType, string[]>>;

  ends: Record<ETodoListType, boolean>;
  ends$: Observable<Record<ETodoListType, boolean>>;

  loading$: Observable<Record<ETodoListType, boolean>>;
  loading: Record<ETodoListType, boolean>;

  loadMore(type: ETodoListType): Observable<void>;

  append(list: IItem[]): void;
  add(item: ICreatedTodoItem): Observable<IItem>;
  update(item: IItem): Observable<IItem>;
  delete(id?: string): Observable<void>;
}

export const IDataService = createIdentifier<IDataService>(Symbol('IDataService'));
