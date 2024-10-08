import type { FC } from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIntl } from '@/i18n';
import { cn } from '@/lib/utils';

export interface IDatePickerProps {
  value?: Date;
  className?: string;
  onChange?: (value: Date | undefined) => void;
}

export const DatePicker: FC<IDatePickerProps> = ({ value, className, onChange }) => {
  const [open, setOpen] = useState(false);
  const handleChangeDate = useCallback(
    (value: Date | undefined) => {
      setOpen(false);
      onChange?.(value);
    },
    [onChange],
  );

  const { t } = useIntl('todo.date-picker');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[8.75rem] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, t('date-formatter')) : <span>{t('placeholder')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={handleChangeDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
