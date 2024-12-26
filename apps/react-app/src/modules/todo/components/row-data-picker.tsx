import type { FC } from 'react';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { from } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLoading } from '@/hooks';
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

  const [loading, handleChangeDate] = useLoading((value?: Date) =>
    dataService.dataMapper$.pipe(
      map((mapper) => mapper[id]),
      take(1),
      tap(() => {
        setOpen(false);
      }),
      concatMap((item) => from(dataService.update({ ...item, overdueAt: value?.valueOf() }))),
    ),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          disabled={loading}
          className={cn('font-mono justify-start text-left font-normal text-muted-foreground px-0', className)}
        >
          {!loading ? null : <Loader2 className="animate-spin mr-2" width={16} height={16} />}
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
