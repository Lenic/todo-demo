'use client';

import type { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { Loader2 } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { asyncScheduler, observeOn, tap } from 'rxjs';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoading } from '@/hooks';
import { language$, useIntl } from '@/i18n';

import { DatePicker } from './components/date-picker';

const dataService = ServiceLocator.default.get(IDataService);

const CreateNewTaskCore: FC = () => {
  const { t } = useIntl('todo.create-new');

  const formSchema = z.object({
    title: z.string().min(2, { message: t('validation-rules.title-length') }),
    date: z.date().nullable(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', date: null },
  });

  const { clearErrors } = form;
  useEffect(() => {
    const subscription = language$.subscribe(() => {
      clearErrors('title');
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [clearErrors]);

  const { handleSubmit, reset, setFocus } = form;
  const [loading, handleEvent] = useLoading((data: z.infer<typeof formSchema>) => {
    return dataService
      .add({
        title: data.title,
        overdueAt: data.date?.valueOf(),
      })
      .pipe(
        tap(() => {
          toast(t('create-success'), { duration: 1_000 });
          reset();
        }),
        observeOn(asyncScheduler),
        tap(() => {
          setFocus('title');
        }),
      );
  });

  return (
    <Form {...form}>
      <form
        className="h-[4.25rem] relative flex flex-row space-x-2"
        onSubmit={(e) => void handleSubmit(handleEvent)(e)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <FormControl>
                <Input placeholder={t('input-placeholder')} {...field} disabled={loading} />
              </FormControl>
              <FormMessage className="absolute left-0 bottom-0" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex-initial">
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} disabled={loading} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="flex-initial" disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2" width={18} height={18} />}
          {t('submit-form')}
        </Button>
      </form>
    </Form>
  );
};
export const CreateNewTask = memo(CreateNewTaskCore);
