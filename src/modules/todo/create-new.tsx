import type { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useIntl } from '@/i18n';
import { ServiceLocator } from '@/lib/injector';
import { IDataService } from '@/resources';

import { DatePicker } from './components/date-picker';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Task title must be at least 2 characters.' }),
  date: z.date().nullable(),
});
type TFormSchema = z.infer<typeof formSchema>;

const formProps = {
  resolver: zodResolver(formSchema),
  defaultValues: { title: '', date: null },
};

const dataService = ServiceLocator.default.get(IDataService);

export const CreateNewTask: FC = () => {
  const { t } = useIntl('todo.create-new');
  const form = useForm<TFormSchema>(formProps);

  const { handleSubmit, reset } = form;
  const handleSubmitForm = handleSubmit((data: TFormSchema) => {
    dataService.add({
      title: data.title,
      overdueAt: data.date?.valueOf(),
    });

    toast({ title: t('create-success'), duration: 1_000 });
    reset();
  });

  return (
    <Form {...form}>
      <form className="h-[4.25rem] relative flex flex-row space-x-2" onSubmit={(e) => void handleSubmitForm(e)}>
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
