import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/interface';
import { combineLatest, distinctUntilChanged, filter, map, of, shareReplay, switchMap } from 'rxjs';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useObservableRef, useObservableSignal } from '@/hooks';
import { listenResize$ } from '@/libs/listen-resize';

const dataService = ServiceLocator.default.get(IDataService);

export interface AutoTooltipProps {
  id: string;
  className?: string;
}

export const AutoTooltip = (props: AutoTooltipProps) => {
  const [setContainer, container$] = useObservableRef<HTMLDivElement>();
  const [setRealElement, realElement$] = useObservableRef<HTMLDivElement>();

  const item$ = dataService.dataMapper$.pipe(
    map((mapper) => mapper[props.id]),
    filter((v) => !!v),
    shareReplay(1),
  );
  const item = useObservableSignal(item$, dataService.dataMapper[props.id]);

  const disabled = useObservableSignal(
    item$.pipe(
      switchMap((item) => {
        if (item.description) {
          return of(false);
        } else {
          return combineLatest([
            container$.pipe(filter((v) => !!v)),
            realElement$.pipe(
              filter((v) => !!v),
              switchMap((el) => listenResize$(el)),
            ),
          ]).pipe(map(([containerElement, entry]) => entry[1] <= containerElement.getBoundingClientRect().height));
        }
      }),
      distinctUntilChanged(),
    ),
    true,
  );

  const containerClassName = () => (!props.className ? {} : { [props.className]: true });
  return (
    <Tooltip openDelay={700} disabled={disabled()}>
      <TooltipTrigger class="truncate flex-initial" classList={{ 'cursor-default': disabled() }}>
        <div ref={setContainer} classList={{ 'relative overflow-hidden': true, ...containerClassName() }}>
          <div class="truncate">{item().title}</div>
          <div ref={setRealElement} class="absolute invisible top-0 left-0 text-wrap">
            {item().title}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div class="max-w-lg whitespace-break-spaces">{item().description || item().title}</div>
      </TooltipContent>
    </Tooltip>
  );
};
