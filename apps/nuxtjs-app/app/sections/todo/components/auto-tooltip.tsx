import { ServiceLocator } from '@todo/container';
import { combineLatest, distinctUntilChanged, filter, map, of, shareReplay, switchMap } from 'rxjs';
import { computed, defineComponent } from 'vue';

import { listenResize$ } from '@/lib/listen-resize';
import { IDBDataService } from '~/services/resources';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/ui/tooltip';

export const AutoTooltip = defineComponent({
  name: 'AutoTooltip',
  props: {
    id: { type: String, required: true },
    className: { type: String, default: '' },
  },
  setup(props) {
    const dataService = ServiceLocator.default.get(IDBDataService);

    const [containerRef, container$] = useRef<HTMLDivElement>();
    const [realElementRef, realElement$] = useRef<HTMLDivElement>();

    const item$ = dataService.dataMapper$.pipe(
      map((mapper) => mapper[props.id]),
      filter((v) => !!v),
      shareReplay(1),
    );
    const itemRef = useObservableShallowRef(item$, dataService.dataMapper[props.id]!);

    const disabledRef = useObservableRef(
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

    const containerClassNameRef = computed(() => ['relative overflow-hidden', props.className].join(' '));
    return () => (
      <TooltipProvider>
        <Tooltip disabled={disabledRef.value}>
          <TooltipTrigger class="truncate flex-initial">
            <div ref={containerRef} class={disabledRef.value ? containerClassNameRef.value : ''}>
              <div class="truncate">{itemRef.value.title}</div>
              <div ref={realElementRef} class="absolute invisible top-0 left-0 text-wrap">
                {itemRef.value.title}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div class="max-w-lg whitespace-break-spaces">{itemRef.value.description ?? itemRef.value.title}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
});
