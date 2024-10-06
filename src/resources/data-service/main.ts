import type { ITodoItem, ITodoListQueryArgs } from '@/api';
import type { Observable } from 'rxjs';

import dayjs from 'dayjs';
import { produce } from 'immer';
import { BehaviorSubject, of, Subject, timer } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mergeWith,
  scan,
  share,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';

import { ETodoListType, ETodoStatus, IDataStorageService } from '@/api';
import { Disposable, injectableWith, ServiceLocator } from '@/lib/injector';

import { TODO_LIST_PAGE_SIZE } from './constants';
import { IDataService } from './types';
import { areArraysEqual, emptyObservable } from './utils';

@injectableWith(IDataService)
export class DataService extends Disposable implements IDataService {
  private appendSubject = new Subject<ITodoItem[]>();
  private updateSubject = new Subject<ITodoItem>();
  private addSubject = new Subject<Omit<ITodoItem, 'id' | 'createdAt' | 'updatedAt'>>();
  private clearSubject = new Subject<string | undefined>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private endsSubject = new Subject<[ETodoListType, boolean]>();
  private storageService = ServiceLocator.default.get(IDataStorageService);

  dataMapper: Record<string, ITodoItem> = {};
  dataMapper$ = emptyObservable<Record<string, ITodoItem>>();

  planningList: string[] = [];
  overdueList: string[] = [];
  archiveList: string[] = [];

  planningList$ = emptyObservable<string[]>();
  overdueList$ = emptyObservable<string[]>();
  archiveList$ = emptyObservable<string[]>();

  ends = {} as Record<ETodoListType, boolean>;
  ends$ = emptyObservable<Record<ETodoListType, boolean>>();

  constructor() {
    super();

    this.build();
  }

  loadMore(type: ETodoListType): Observable<void> {
    return this.loadingSubject.pipe(
      take(1),
      switchMap((x) => {
        if (x) {
          return this.loadingSubject.pipe(
            filter((v) => !v),
            take(1),
            map(() => void 0),
          );
        } else {
          this.loadingSubject.next(true);

          const args = this.getQueryArgs(type);
          return this.storageService.query(args).pipe(
            map((list) => {
              this.endsSubject.next([type, list.length < TODO_LIST_PAGE_SIZE]);
              this.append(list);
            }),
            finalize(() => this.loadingSubject.next(false)),
          );
        }
      }),
    );
  }

  append(list: ITodoItem[]): void {
    this.appendSubject.next(list);
  }

  add(item: Omit<ITodoItem, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.addSubject.next(item);
  }

  update(item: ITodoItem): void {
    this.updateSubject.next(item);
  }

  delete(id?: string): void {
    this.clearSubject.next(id);
  }

  private build() {
    const changeObject$ = this.appendSubject.pipe(
      map((list) => ({ type: 'append', list }) as const),
      mergeWith(this.addSubject.pipe(map((item) => ({ type: 'add', item }) as const))),
      mergeWith(this.updateSubject.pipe(map((item) => ({ type: 'update', item }) as const))),
      mergeWith(
        this.clearSubject.pipe(map((id) => (id ? ({ type: 'delete', id } as const) : ({ type: 'clear' } as const)))),
      ),
      concatMap((obj) => {
        switch (obj.type) {
          case 'delete':
            return this.storageService.delete(obj.id).pipe(map(() => obj));
          case 'add':
            return this.storageService.add(obj.item).pipe(map((item) => ({ type: 'update', item }) as const));
          case 'update':
            return this.storageService.update(obj.item).pipe(map((item) => ({ type: 'update', item }) as const));
          default:
            return of(obj);
        }
      }),
      share(),
    );

    this.dataMapper$ = changeObject$.pipe(
      scan(
        (acc, x) => {
          switch (x.type) {
            case 'append':
              return x.list.reduce((x, y) => ({ ...x, [y.id]: y }), acc);
            case 'update':
              return { ...acc, [x.item.id]: x.item };
            case 'delete':
              return produce(acc, (draft) => void delete draft[x.id]);
            case 'clear':
              return {};
            default:
              break;
          }
          return acc;
        },
        {} as Record<string, ITodoItem>,
      ),
      shareReplay(1),
    );
    this.disposeWithMe(this.dataMapper$.subscribe((mapper) => void (this.dataMapper = mapper)));
    this.disposeWithMe(() => void (this.dataMapper = {}));

    // current date switcher
    const pageTimer$ = timer(0, 10_000).pipe(
      map(() => dayjs().date()),
      distinctUntilChanged(),
      share(),
    );

    this.planningList$ = pageTimer$.pipe(
      switchMap(() => this.dataMapper$),
      map((mapper) => {
        const todayStartTimeValue = dayjs().startOf('day').valueOf();
        return Object.values(mapper)
          .filter(
            (v) =>
              v.status === ETodoStatus.PENDING &&
              (!v.overdueAt || (!!v.overdueAt && v.overdueAt >= todayStartTimeValue)),
          )
          .sort((x, y) => y.createdAt - x.createdAt)
          .map((v) => v.id);
      }),
      distinctUntilChanged(areArraysEqual),
      shareReplay(1),
    );
    this.disposeWithMe(this.planningList$.subscribe((list) => void (this.planningList = list)));
    this.disposeWithMe(() => void (this.planningList = []));

    this.overdueList$ = pageTimer$.pipe(
      switchMap(() => this.dataMapper$),
      map((mapper) => {
        const todayStartTimeValue = dayjs().startOf('day').valueOf();
        return Object.values(mapper)
          .filter((v) => v.status === ETodoStatus.PENDING && !!v.overdueAt && v.overdueAt < todayStartTimeValue)
          .sort((x, y) => y.createdAt - x.createdAt)
          .map((v) => v.id);
      }),
      distinctUntilChanged(areArraysEqual),
      shareReplay(1),
    );
    this.disposeWithMe(this.overdueList$.subscribe((list) => void (this.overdueList = list)));
    this.disposeWithMe(() => void (this.overdueList = []));

    this.archiveList$ = pageTimer$.pipe(
      switchMap(() => this.dataMapper$),
      map((mapper) => {
        return Object.values(mapper)
          .filter((v) => v.status === ETodoStatus.DONE)
          .sort((x, y) => y.updatedAt - x.updatedAt)
          .map((v) => v.id);
      }),
      distinctUntilChanged(areArraysEqual),
      shareReplay(1),
    );
    this.disposeWithMe(this.archiveList$.subscribe((list) => void (this.archiveList = list)));
    this.disposeWithMe(() => void (this.archiveList = []));

    this.ends = { [ETodoListType.PENDING]: false, [ETodoListType.OVERDUE]: false, [ETodoListType.ARCHIVE]: false };
    this.ends$ = this.endsSubject.pipe(scan((acc, x) => ({ ...acc, [x[0]]: x[1] }), this.ends));
    this.disposeWithMe(this.ends$.subscribe((ends) => void (this.ends = ends)));
  }

  private getQueryArgs(type: ETodoListType) {
    let offset = 0;
    switch (type) {
      case ETodoListType.PENDING:
        offset = this.planningList.length;
        break;
      case ETodoListType.OVERDUE:
        offset = this.overdueList.length;
        break;
      default:
        offset = this.archiveList.length;
        break;
    }

    const args: ITodoListQueryArgs = {
      type,
      offset,
      limit: TODO_LIST_PAGE_SIZE,
    };
    return args;
  }
}
