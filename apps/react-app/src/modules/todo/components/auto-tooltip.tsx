import type { FC, RefObject } from 'react';
import type { Observable } from 'rxjs';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/interface';
import { useEffect, useMemo, useRef, useState } from 'react';
import { combineLatest, distinctUntilChanged, filter, map, of, ReplaySubject, shareReplay, switchMap } from 'rxjs';

import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useObservableState } from '@/hooks';
import { listenResize$ } from '@/lib/listen-resize';

export interface IAutoTooltipWithDescriptionProps {
  id: string;
  className?: string;
}

const defaultStoreValue = Symbol('default_store_value');
function useObservableRef<T>(): [RefObject<T>, Observable<T | null>] {
  const targetRef = useRef<T>(null);
  const storeRef = useRef<T | null | symbol>(defaultStoreValue);
  const [trigger] = useState(() => new ReplaySubject<T | null>(1));

  useEffect(() => {
    if (storeRef.current !== targetRef.current) {
      storeRef.current = targetRef.current;
      trigger.next(targetRef.current);
    }
  });

  return [targetRef, trigger];
}

const dataService = ServiceLocator.default.get(IDataService);

export const AutoTooltip: FC<IAutoTooltipWithDescriptionProps> = (props) => {
  const { className, id } = props;

  const item$ = useMemo(
    () =>
      dataService.dataMapper$.pipe(
        map((mapper) => mapper[id]),
        filter((v) => !!v),
        shareReplay(1),
      ),
    [id],
  );
  const item = useObservableState(item$, dataService.dataMapper[id]);

  const [targetRef, target$] = useObservableRef<HTMLDivElement>();
  const [containerRef, container$] = useObservableRef<HTMLDivElement>();
  const disabled = useObservableState(
    useMemo(
      () =>
        item$.pipe(
          switchMap((item) =>
            item.description
              ? of(false)
              : combineLatest([
                  container$.pipe(filter((v) => !!v)),
                  target$.pipe(
                    filter((v) => !!v),
                    switchMap((el) => listenResize$(el)),
                  ),
                ]).pipe(
                  map(([containerElement, entry]) => entry[1] <= containerElement.getBoundingClientRect().height),
                ),
          ),
          distinctUntilChanged(),
        ),
      [container$, item$, target$],
    ),
    true,
  );

  const containerClassName = ['relative overflow-hidden', className ?? ''].join(' ');
  const trigger = (
    <div ref={containerRef} className={disabled ? containerClassName : ''}>
      <div className="truncate">{item.title}</div>
      <div ref={targetRef} className="absolute invisible top-0 left-0 text-wrap">
        {item.title}
      </div>
    </div>
  );

  if (disabled) return trigger;
  return (
    <TooltipProvider disableHoverableContent={disabled}>
      <Tooltip>
        <TooltipTrigger className={containerClassName}>{trigger}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <div className="max-w-lg whitespace-break-spaces">{item.description ? item.description : item.title}</div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
