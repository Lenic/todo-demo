import type { PropType } from 'vue';

import { combineLatest, filter, map, of, switchMap } from 'rxjs';
import { computed, defineComponent } from 'vue';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useObservableRef, useObservableWatch, useRef } from '@/hooks';
import { listenResize$ } from '@/lib/listen-resize';

export const AutoTooltip = defineComponent({
  name: 'AutoTooltip',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    className: { type: String, default: '' },
    onClick: { type: Function as PropType<() => void>, required: true },
  },
  setup(props) {
    const [containerRef, container$] = useRef<HTMLDivElement>();
    const [realElementRef, realElement$] = useRef<HTMLDivElement>();

    const props$ = useObservableWatch(() => props, { deep: true });
    const disabledRef = useObservableRef(
      props$.pipe(
        switchMap((p) => {
          if (p.title !== p.description) {
            return of(false);
          } else {
            return combineLatest([
              container$.pipe(filter((v) => !!v)),
              realElement$.pipe(
                filter((v) => !!v),
                switchMap((el) =>
                  listenResize$(el).pipe(
                    filter((entries) => !!entries.length),
                    map((entries) => entries[0]),
                  ),
                ),
              ),
            ]).pipe(
              map(([containerElement, entry]) =>
                containerElement ? entry.contentRect.height <= containerElement.getBoundingClientRect().height : false,
              ),
            );
          }
        }),
      ),
      true,
    );

    const containerClassNameRef = computed(() => ['relative overflow-hidden', props.className].join(' '));
    return () => (
      <TooltipProvider disabled={disabledRef.value}>
        <Tooltip>
          <TooltipTrigger>
            <div
              ref={containerRef}
              class={disabledRef.value ? containerClassNameRef.value : ''}
              onClick={props.onClick}
            >
              <div class="truncate">{props.title}</div>
              <div ref={realElementRef} class="absolute invisible top-0 left-0 text-wrap">
                {props.title}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div class="max-w-lg whitespace-break-spaces">{props.description}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
});
