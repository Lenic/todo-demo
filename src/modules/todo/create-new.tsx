import type { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ETodoStatus } from '@/api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useIntl } from '@/i18n';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';

import { DatePicker } from './components/date-picker';

const FormSchema = z.object({
  title: z.string().min(2, { message: 'Task title must be at least 2 characters.' }),
  date: z.date().optional(),
});

export const CreateNewTask: FC = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
    },
  });

  const { t } = useIntl('todo.create-new');

  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    dataService.add({
      status: ETodoStatus.PENDING,
      title: data.title,
      overdueAt: data.date?.valueOf(),
    });

    toast({ title: t('create-success'), duration: 1_000 });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="h-[4.25rem] relative flex flex-row space-x-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <FormControl>
                <Input placeholder={t('input-placeholder')} {...field} />
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
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="flex-initial">
          {t('submit-form')}
        </Button>
      </form>
    </Form>
  );
};
