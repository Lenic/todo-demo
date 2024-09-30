import type { Observable } from 'rxjs';

import dayjs from 'dayjs';
import { produce } from 'immer';
import { interval, Subject, timer } from 'rxjs';
import { distinctUntilChanged, map, mergeWith, scan, share, shareReplay, switchMap } from 'rxjs/operators';

import { Disposable, injectableWith } from '@/lib/injector';

import { IDataService, ITodoItem, ETodoStatus } from './types';
import { areArraysEqual } from './utils';

@injectableWith(IDataService)
export class DataService extends Disposable implements IDataService {
  private appendSubject = new Subject<ITodoItem[]>();
  private updateSubject = new Subject<ITodoItem>();
  private clearSubject = new Subject<string | undefined>();

  dataMapper: Record<string, ITodoItem>;
  dataMapper$: Observable<Record<string, ITodoItem>>;

  planningList$: Observable<string[]>;
  overdueList$: Observable<string[]>;
  archiveList$: Observable<string[]>;

  constructor() {
    super();

    const changeObject$ = this.appendSubject.pipe(
      map((list) => ({ type: 'append', list }) as const),
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

    this.dataMapper = {};
    this.disposeWithMe(this.dataMapper$.subscribe((mapper) => void (this.dataMapper = mapper)));

    // current date switcher
    const pageTimer$ = timer(0, 10_000).pipe(
      map(() => dayjs().date()),
      distinctUntilChanged(),
      shareReplay(1),
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
  }

  append(list: ITodoItem[]): void {
    this.appendSubject.next(list);
  }

  addOrUpdate(item: ITodoItem): void {
    this.updateSubject.next(item);
  }
  delete(id?: string): void {
    this.clearSubject.next(id);
  }
}
