import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-solid';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { createSignal } from 'solid-js';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLoading } from '@/hooks';
import { cn } from '@/libs/cn';

const dataService = ServiceLocator.default.get(IDataService);

export interface RowDatePicker {
  id: string;
  value?: number;
  className?: string;
  formatString: string;
  disabled: boolean;
}

export const RowDatePicker = (props: RowDatePicker) => {
  const [open, setOpen] = createSignal(false);

  const [loading, handleChangeDate] = useLoading((e: number | null) =>
    dataService.dataMapper$.pipe(
      map((mapper) => mapper[props.id]),
      take(1),
      tap(() => void setOpen(false)),
      concatMap((item) => dataService.update({ ...item, overdueAt: !e ? undefined : e.valueOf() })),
    ),
  );

  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled} classList={{ 'cursor-not-allowed': props.disabled }}>
        <Button
          variant="link"
          disabled={loading() || props.disabled}
          class={cn('font-mono justify-start text-left font-normal text-muted-foreground px-0', props.className)}
        >
          {!loading() ? null : <Loader2 class="animate-spin mr-2" width={16} height={16} />}
          {props.value ? null : <CalendarIcon class="h-4 w-4" />}
          {props.value ? dayjs(props.value).format(props.formatString) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar value={props.value} onChange={handleChangeDate} />
      </PopoverContent>
    </Popover>
  );
};
