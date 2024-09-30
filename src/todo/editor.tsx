import { useMemo, type FC, useId, useCallback } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ServiceLocator } from '@/lib/injector';
import { IDataService, ETodoStatus } from '@/resources';
import { DatePicker } from './components/date-picker';
import { map, take } from 'rxjs/operators';

export interface ITodoItemEditorProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FormSchema = z.object({
  title: z.string().min(2, { message: 'Task title must be at least 2 characters.' }),
  date: z.date().optional(),
  checked: z.boolean(),
});

export const TodoItemEditor: FC<ITodoItemEditorProps> = ({ id, open, onOpenChange }) => {
  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);
  const item = dataService.dataMapper[id];
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      title: item.title,
      checked: item.status === ETodoStatus.DONE,
      date: item.overdueAt ? new Date(item.overdueAt) : undefined,
    },
  });

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dataService.dataMapper$
      .pipe(
        map((mapper) => mapper[id]),
        take(1),
      )
      .subscribe((item) => {
        const now = Date.now();
        dataService.addOrUpdate({
          ...item,
          updatedAt: now,
          title: data.title,
          overdueAt: data.date?.valueOf(),
          status: data.checked ? ETodoStatus.DONE : ETodoStatus.PENDING,
        });

        toast({ title: 'Update the task successfully.' });
        handleClose();
      });
  }

  const checkboxKey = useId();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Todo Task Editor</DialogTitle>
        </DialogHeader>
        <DialogDescription>You can change all of your task infomation here.</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-2 justify-between items-center">
              <FormField
                control={form.control}
                name="checked"
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox id={checkboxKey} checked={value} onCheckedChange={onChange} {...rest} />
                        <Label htmlFor={checkboxKey} className="cursor-pointer">
                          {value ? 'Done' : 'Pending'}
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea rows={6} placeholder="Input your task title" {...field} />
                  </FormControl>
                  <FormMessage className="absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
