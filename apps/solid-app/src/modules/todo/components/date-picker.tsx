import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-solid';
import { createMemo, createSignal } from 'solid-js';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIntl } from '@/i18n';
import { cn } from '@/libs/cn';

export interface DatePickerProps {
  value: number | null;
  disabled?: boolean;
  className?: string;
  onChange?: (value: number | null) => void;
}

export const DatePicker = (props: DatePickerProps) => {
  const [open, setOpen] = createSignal(false);
  const handleChangeDate = (value: number | null) => {
    setOpen(false);
    props.onChange?.(value);
  };

  const { t } = useIntl('todo.date-picker');
  const placeholder = createMemo(() => (props.value ? dayjs(props.value).format(t('date-formatter')) : null));
  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled}>
        <Button
          size="lg"
          variant="outline"
          disabled={props.disabled}
          class={cn(
            'max-w-[8.75rem] justify-start text-left font-normal px-4',
            !props.value && 'text-muted-foreground',
            props.className,
          )}
        >
          <CalendarIcon class="h-4 w-4 mr-2" />
          {placeholder() ?? <span>{t('placeholder')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar value={props.value} onChange={handleChangeDate} />
      </PopoverContent>
    </Popover>
  );
};
