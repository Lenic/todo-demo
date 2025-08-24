import type { IDBCreatedTodoItem, IDBTodoItem, IDBTodoListQueryArgs } from '../../api';
import type { IDataService } from '@todo/interface';
import type { Observable } from 'rxjs';

import { Disposable } from '@todo/container';
import {
  areArraysEqual,
  emptyObservable,
  ETodoListType,
  ETodoStatus,
  getInitialStatus,
  TODO_LIST_PAGE_SIZE,
} from '@todo/interface';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { BehaviorSubject, combineLatest, EMPTY, from, Subject, timer } from 'rxjs';
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
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { addTodoItem, deleteTodoItem, queryTodoList, updateTodoItem } from '~/app/server/todo';
import { message$ } from '~/components/monitor';

class DataService extends Disposable implements IDataService<IDBTodoItem> {
  private appendSubject = new Subject<IDBTodoItem[]>();
  private updateSubject = new Subject<IDBTodoItem>();
  private addSubject = new Subject<IDBTodoItem>();
  private clearSubject = new Subject<string | undefined>();
  private loadingSubject = new BehaviorSubject<ETodoListType | null>(null);
  private endsSubject = new Subject<[ETodoListType, boolean]>();

  loading = getInitialStatus(false);
  loading$ = emptyObservable<Record<ETodoListType, boolean>>();

  dataMapper: Record<string, IDBTodoItem> = {};
  dataMapper$ = emptyObservable<Record<string, IDBTodoItem>>();

  ids = getInitialStatus<string[]>([]);
  ids$ = emptyObservable<Record<ETodoListType, string[]>>();

  ends = getInitialStatus(false);
  ends$ = emptyObservable<Record<ETodoListType, boolean>>();

  constructor() {
    super();

    this.build();
  }

  loadMore(type: ETodoListType): Observable<void> {
    if (this.loading[type]) {
      return this.loading$.pipe(
        map((mapper) => mapper[type]),
        filter((v) => !v),
        take(1),
        map(() => void 0),
      );
    } else {
      this.loadingSubject.next(type);

      const args: Omit<IDBTodoListQueryArgs, 'userId'> = {
        type,
        limit: TODO_LIST_PAGE_SIZE,
        offset: this.ids[type].length,
        todyZero: dayjs().startOf('day').valueOf(),
      };
      console.log(args);
      return from(queryTodoList(args)).pipe(
        map((list) => {
          this.endsSubject.next([type, list.length < TODO_LIST_PAGE_SIZE]);
          this.append(list);
        }),
        finalize(() => {
          this.loadingSubject.next(type);
        }),
      );
    }
  }

  append(list: IDBTodoItem[]): void {
    this.appendSubject.next(list);
  }

  add(item: IDBCreatedTodoItem): Observable<IDBTodoItem> {
    return from(addTodoItem(item)).pipe(
      tap((value) => {
        this.addSubject.next(value);
      }),
    );
  }

  update(item: IDBTodoItem): Observable<IDBTodoItem> {
    return from(updateTodoItem(item)).pipe(
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
      return from(deleteTodoItem(id)).pipe(
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
              return x.list.reduce((x, y) => ({ ...x, [y.id]: y }), acc);
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
        {} as Record<string, IDBTodoItem>,
      ),
      shareReplay(1),
    );
    this.disposeWithMe(this.dataMapper$.subscribe((mapper) => void (this.dataMapper = mapper)));
    this.disposeWithMe(() => void (this.dataMapper = {}));

    // current date switcher
    const pageTimer$ = timer(10_000, 10_000).pipe(
      startWith(0),
      map(() => dayjs().date()),
      distinctUntilChanged(),
      switchMap(() => this.dataMapper$),
      map((mapper) => Object.values(mapper)),
      shareReplay(1),
    );

    this.ids$ = combineLatest([
      pageTimer$.pipe(
        map((list) => {
          const todayStartTimeValue = dayjs().startOf('day').valueOf();
          return list
            .filter(
              (v) =>
                v.status === ETodoStatus.PENDING &&
                (!v.overdueAt || (!!v.overdueAt && v.overdueAt >= todayStartTimeValue)),
            )
            .sort((x, y) => y.createdAt - x.createdAt)
            .map((v) => v.id);
        }),
        distinctUntilChanged(areArraysEqual),
        map((list) => [ETodoListType.PENDING, list] as const),
      ),
      pageTimer$.pipe(
        map((list) => {
          const todayStartTimeValue = dayjs().startOf('day').valueOf();
          return list
            .filter((v) => v.status === ETodoStatus.PENDING && !!v.overdueAt && v.overdueAt < todayStartTimeValue)
            .sort((x, y) => y.createdAt - x.createdAt)
            .map((v) => v.id);
        }),
        distinctUntilChanged(areArraysEqual),
        map((list) => [ETodoListType.OVERDUE, list] as const),
      ),
      pageTimer$.pipe(
        map((list) => {
          return list
            .filter((v) => v.status === ETodoStatus.DONE)
            .sort((x, y) => y.updatedAt - x.updatedAt)
            .map((v) => v.id);
        }),
        distinctUntilChanged(areArraysEqual),
        map((list) => [ETodoListType.ARCHIVE, list] as const),
      ),
    ]).pipe(
      map(([pending, overdue, archive]) => ({
        [pending[0]]: pending[1],
        [overdue[0]]: overdue[1],
        [archive[0]]: archive[1],
      })),
      shareReplay(1),
    );
    this.disposeWithMe(this.ids$.subscribe((ids) => void (this.ids = ids)));
    this.disposeWithMe(() => void (this.ids = {} as Record<ETodoListType, string[]>));

    this.ends$ = this.endsSubject.pipe(
      scan((acc, x) => ({ ...acc, [x[0]]: x[1] }), this.ends),
      startWith(this.ends),
      shareReplay(1),
    );
    this.disposeWithMe(this.ends$.subscribe((ends) => void (this.ends = ends)));
    this.disposeWithMe(() => void (this.ends = {} as Record<ETodoListType, boolean>));

    this.loading$ = this.loadingSubject.pipe(
      scan((acc, x) => (!x ? acc : { ...acc, [x]: !acc[x] }), this.loading),
      shareReplay(1),
    );
    this.disposeWithMe(this.loading$.subscribe((loading) => void (this.loading = loading)));
    this.disposeWithMe(() => void (this.loading = {} as Record<ETodoListType, boolean>));

    this.disposeWithMe(
      message$.pipe(filter((v) => v.type === 'add-todo')).subscribe(({ item }) => {
        this.addSubject.next(item);
      }),
    );

    this.disposeWithMe(
      message$
        .pipe(
          filter((v) => v.type === 'update-todo'),
          filter((v) => v.item.id in this.dataMapper),
        )
        .subscribe(({ item }) => {
          this.updateSubject.next(item);
        }),
    );

    this.disposeWithMe(
      message$.pipe(filter((v) => v.type === 'delete-todo')).subscribe(({ id }) => {
        this.clearSubject.next(id);
      }),
    );
  }
}

export { DataService };
