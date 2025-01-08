import { CalendarDate, type DateValue } from '@internationalized/date';
import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-vue-next';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { computed, defineComponent, ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLoading } from '@/hooks';
import { cn } from '@/lib/utils';

const dataService = ServiceLocator.default.get(IDataService);

export const RowDatePicker = defineComponent({
  name: 'RowDatePicker',
  props: {
    id: { type: String, required: true },
    value: { type: Number },
    className: { type: String },
    formatString: { type: String, required: true },
  },
  setup(props) {
    const openRef = ref(false);

    const [loadingRef, handleChangeDate] = useLoading((value?: DateValue) =>
      dataService.dataMapper$.pipe(
        map((mapper) => mapper[props.id]),
        take(1),
        tap(() => {
          openRef.value = false;
        }),
        concatMap((item) =>
          dataService.update({ ...item, overdueAt: !value ? undefined : dayjs(value.toString()).valueOf() }),
        ),
      ),
    );

    const calendarValueRef = computed(() => {
      if (typeof props.value === 'undefined') return undefined;

      const currentDate = dayjs(props.value);
      return new CalendarDate(currentDate.year(), currentDate.month(), currentDate.date());
    });
    return () => (
      <Popover v-model:open={openRef.value}>
        <PopoverTrigger asChild>
          <Button
            variant="link"
            disabled={loadingRef.value}
            class={cn('font-mono justify-start text-left font-normal text-muted-foreground px-0', props.className)}
          >
            {!loadingRef.value ? null : <Loader2 class="animate-spin mr-2" width={16} height={16} />}
            {props.value ? null : <CalendarIcon class="h-4 w-4" />}
            {props.value ? dayjs(props.value).format(props.formatString) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            multiple={false}
            modelValue={calendarValueRef.value}
            onUpdate:modelValue={handleChangeDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
});
