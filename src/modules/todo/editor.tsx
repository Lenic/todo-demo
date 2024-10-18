import type { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { map, take } from 'rxjs/operators';
import { z } from 'zod';

import { ETodoStatus } from '@/api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useIntl } from '@/i18n';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';

import { DatePicker } from './components/date-picker';

export interface ITodoItemEditorProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  title: z.string().min(2, { message: 'Task title must be at least 2 characters.' }),
  description: z.string(),
  date: z.date().nullable(),
  checked: z.boolean(),
});
type TFormSchema = z.infer<typeof formSchema>;

const formProps = {
  resolver: zodResolver(formSchema),
  defaultValues: { title: '', description: '', checked: false, date: null },
};

const dataService = ServiceLocator.default.get(IDataService);

export const TodoItemEditor: FC<ITodoItemEditorProps> = ({ id, open, onOpenChange }) => {
  const form = useForm<TFormSchema>(formProps);
  const [disableEditing] = useState(() => dataService.dataMapper[id].status === ETodoStatus.DONE);

  const { reset } = form;
  useEffect(() => {
    const subscription = dataService.dataMapper$.pipe(map((mapper) => mapper[id])).subscribe((item) => {
      reset({
        title: item.title,
        description: item.description ?? '',
        checked: item.status === ETodoStatus.DONE,
        date: item.overdueAt ? new Date(item.overdueAt) : null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [reset, id]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const { t } = useIntl('todo.editor');
  const handleSubmitForm = form.handleSubmit((data) => {
    dataService.dataMapper$
      .pipe(
        map((mapper) => mapper[id]),
        take(1),
      )
      .subscribe((item) => {
        dataService.update({
          ...item,
          title: data.title,
          description: data.description,
          overdueAt: data.date?.valueOf(),
          status: data.checked ? ETodoStatus.DONE : ETodoStatus.PENDING,
        });

        toast({ title: t('update-success'), duration: 1_000 });
        handleClose();
      });
  });

  const checkboxKey = useId();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-md:w-full max-md:inset-0 max-md:top-[unset] max-md:transform-none">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('title')}</DialogDescription>
        <Form {...form}>
          <form className="flex flex-col space-y-2" onSubmit={(e) => void handleSubmitForm(e)}>
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
                          {value ? t('status.done') : t('status.pending')}
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
                      <DatePicker value={field.value} onChange={field.onChange} disabled={disableEditing} />
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
                    <Input placeholder={t('title-placeholder')} {...field} disabled={disableEditing} />
                  </FormControl>
                  <FormMessage className="absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder={t('description-placeholder')}
                      {...field}
                      disabled={disableEditing}
                    />
                  </FormControl>
                  <FormMessage className="absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={handleClose}>
                {t('cancel')}
              </Button>
              <Button type="submit">{t('submit')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
