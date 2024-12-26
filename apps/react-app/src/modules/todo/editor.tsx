import type { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/controllers';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { firstValueFrom } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useIntl } from '@/i18n';

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
    reset();
    onOpenChange(false);
  }, [onOpenChange, reset]);

  const { t } = useIntl('todo.editor');
  const handleSubmitForm = form.handleSubmit((data) =>
    firstValueFrom(
      dataService.dataMapper$.pipe(
        map((mapper) => mapper[id]),
        take(1),
        concatMap((item) =>
          dataService
            .update({
              ...item,
              title: data.title,
              description: data.description,
              overdueAt: data.date?.valueOf(),
              status: data.checked ? ETodoStatus.DONE : ETodoStatus.PENDING,
            })
            .then(
              () => {
                toast({ title: t('update-success'), duration: 1_000 });
                onOpenChange(false);
              },
              () => {
                toast({ title: t('update-failure'), duration: 0 });
              },
            ),
        ),
      ),
    ),
  );

  const checkboxKey = useId();
  const disableEditing = form.watch('checked', false);
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
              <Button type="button" variant="secondary" onClick={handleClose} disabled={form.formState.isSubmitting}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="animate-spin mr-2" width={18} height={18} />}
                {t('submit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};