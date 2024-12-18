import type { FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { map, take } from 'rxjs/operators';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface IRowDatePickerProps {
  id: string;
  value?: Date;
  className?: string;
  formatString: string;
}

const dataService = ServiceLocator.default.get(IDataService);

export const RowDatePicker: FC<IRowDatePickerProps> = ({ id, value, className, formatString }) => {
  const [open, setOpen] = useState(false);

  const handleChangeDate = useCallback(
    (value: Date | undefined) => {
      dataService.dataMapper$
        .pipe(
          map((mapper) => mapper[id]),
          take(1),
        )
        .subscribe((item) => {
          setOpen(false);
          dataService.update({ ...item, overdueAt: value?.valueOf() });
        });
    },
    [id],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className={cn('font-mono justify-start text-left font-normal text-muted-foreground px-0', className)}
        >
          {value ? null : <CalendarIcon className="h-4 w-4" />}
          {value ? format(value, formatString) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={handleChangeDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
