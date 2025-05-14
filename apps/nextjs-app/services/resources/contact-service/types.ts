import type { IContactItem, ICreatedContactItem } from '../../api';
import type { Observable } from 'rxjs';

import { createIdentifier } from '@todo/container';

export interface IContactService {
  dataMapper: Record<string, IContactItem>;
  dataMapper$: Observable<Record<string, IContactItem>>;

  ids: string[];
  ids$: Observable<string[]>;

  end: boolean;
  end$: Observable<boolean>;

  loading$: Observable<boolean>;
  loading: boolean;

  loadMore(): Observable<void>;

  append(list: IContactItem[]): void;
  add(item: Omit<ICreatedContactItem, 'userId'>): Observable<IContactItem>;
  update(item: IContactItem): Observable<IContactItem>;
  delete(id?: string): Observable<void>;
}

export const IContactService = createIdentifier<IContactService>(Symbol('IContactService'));
