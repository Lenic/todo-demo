import type { IContactItem, IContactListQueryArgs, ICreatedContactItem } from '../../api';
import type { IContactService } from './types';
import type { Observable } from 'rxjs';

import { Disposable } from '@todo/container';
import { areArraysEqual, TODO_LIST_PAGE_SIZE } from '@todo/interface';
import { produce } from 'immer';
import { BehaviorSubject, EMPTY, from, NEVER, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mergeWith,
  scan,
  share,
  shareReplay,
  startWith,
  take,
  tap,
} from 'rxjs/operators';

import { addContactItem, deleteContactItem, queryContactList, updateContactItem } from '@/app/server/contact';
import { message$ } from '@/components/monitor';

export class ContactService extends Disposable implements IContactService {
  private appendSubject = new Subject<IContactItem[]>();
  private updateSubject = new Subject<IContactItem>();
  private addSubject = new Subject<IContactItem>();
  private clearSubject = new Subject<string | undefined>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private endsSubject = new Subject<boolean>();

  loading = false;
  loading$ = NEVER as Observable<boolean>;

  dataMapper: Record<string, IContactItem> = {};
  dataMapper$ = NEVER as Observable<Record<string, IContactItem>>;

  ids = [] as string[];
  ids$ = NEVER as Observable<string[]>;

  end = false;
  end$ = NEVER as Observable<boolean>;

  constructor() {
    super();

    this.build();
  }

  loadMore(): Observable<void> {
    if (this.loading) {
      return this.loading$.pipe(
        filter((v) => !v),
        take(1),
        map(() => void 0),
      );
    } else {
      this.loadingSubject.next(true);

      const args: Omit<IContactListQueryArgs, 'userId'> = {
        limit: TODO_LIST_PAGE_SIZE,
        offset: this.ids.length,
      };
      console.log(args);
      return from(queryContactList(args)).pipe(
        map((list) => {
          this.endsSubject.next(list.length < TODO_LIST_PAGE_SIZE);
          this.append(list);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        }),
      );
    }
  }

  append(list: IContactItem[]): void {
    this.appendSubject.next(list);
  }

  add(item: Omit<ICreatedContactItem, 'userId'>): Observable<IContactItem> {
    return from(addContactItem(item)).pipe(
      tap((value) => {
        this.addSubject.next(value);
      }),
    );
  }

  update(item: IContactItem): Observable<IContactItem> {
    return from(updateContactItem(item)).pipe(
      tap((value) => {
        this.updateSubject.next(value);
      }),
    );
  }

  delete(id?: string): Observable<void> {
    if (!id) {
      this.clearSubject.next(void 0);
      return EMPTY;
    } else {
      return from(deleteContactItem(id)).pipe(
        tap(() => {
          this.clearSubject.next(id);
        }),
      );
    }
  }

  private build() {
    const changeObject$ = this.appendSubject.pipe(
      map((list) => ({ type: 'append', list }) as const),
      mergeWith(this.addSubject.pipe(map((item) => ({ type: 'add', item }) as const))),
      mergeWith(this.updateSubject.pipe(map((item) => ({ type: 'update', item }) as const))),
      mergeWith(
        this.clearSubject.pipe(map((id) => (id ? ({ type: 'delete', id } as const) : ({ type: 'clear' } as const)))),
      ),
      share(),
    );

    this.dataMapper$ = changeObject$.pipe(
      scan(
        (acc, x) => {
          switch (x.type) {
            case 'append':
              return x.list.reduce(
                (x, deleteContactItem) => ({ ...x, [deleteContactItem.id]: deleteContactItem }),
                acc,
              );
            case 'add':
            case 'update':
              return { ...acc, [x.item.id]: x.item };
            case 'delete':
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- simple code
              return produce(acc, (draft) => void delete draft[x.id]);
            case 'clear':
              return {};
            default:
              break;
          }
          return acc;
        },
        {} as Record<string, IContactItem>,
      ),
      shareReplay(1),
    );
    this.disposeWithMe(this.dataMapper$.subscribe((mapper) => void (this.dataMapper = mapper)));
    this.disposeWithMe(() => void (this.dataMapper = {}));

    this.ids$ = this.dataMapper$.pipe(
      map((mapper) => Object.values(mapper)),
      map((list) => list.map((v) => v.id)),
      distinctUntilChanged(areArraysEqual),
      shareReplay(1),
    );
    this.disposeWithMe(this.ids$.subscribe((ids) => void (this.ids = ids)));
    this.disposeWithMe(() => void (this.ids = []));

    this.end$ = this.endsSubject.pipe(startWith(this.end), shareReplay(1));
    this.disposeWithMe(this.end$.subscribe((end) => void (this.end = end)));
    this.disposeWithMe(() => void (this.end = false));

    this.loading$ = this.loadingSubject.pipe(shareReplay(1));
    this.disposeWithMe(this.loading$.subscribe((loading) => void (this.loading = loading)));
    this.disposeWithMe(() => void (this.loading = false));

    this.disposeWithMe(
      message$.pipe(filter((v) => v.type === 'add-contact')).subscribe(({ item }) => {
        this.addSubject.next(item);
      }),
    );

    this.disposeWithMe(
      message$
        .pipe(
          filter((v) => v.type === 'update-contact'),
          filter((v) => v.item.id in this.dataMapper),
        )
        .subscribe(({ item }) => {
          this.updateSubject.next(item);
        }),
    );

    this.disposeWithMe(
      message$.pipe(filter((v) => v.type === 'delete-contact')).subscribe(({ id }) => {
        this.clearSubject.next(id);
      }),
    );
  }
}
