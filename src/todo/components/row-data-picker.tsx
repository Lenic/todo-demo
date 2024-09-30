import { useCallback, useMemo, type FC } from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';
import { map, take } from 'rxjs/operators';

export interface IRowDatePickerProps {
  id: string;
  value?: Date;
  className?: string;
  formatString: string;
}

export const RowDatePicker: FC<IRowDatePickerProps> = ({ id, value, className, formatString }) => {
  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);

  const handleChangeDate = useCallback(
    (value: Date | undefined) => {
      dataService.dataMapper$
        .pipe(
          map((mapper) => mapper[id]),
          take(1),
        )
        .subscribe((item) => {
          dataService.addOrUpdate({ ...item, overdueAt: value?.valueOf() });
        });
    },
    [dataService, id],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className={cn('w-[8.75rem] justify-start text-left font-normal text-muted-foreground px-0', className)}
        >
          {value ? null : <CalendarIcon className="mr-2 h-4 w-4" />}
          {value ? format(value, formatString) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={handleChangeDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
