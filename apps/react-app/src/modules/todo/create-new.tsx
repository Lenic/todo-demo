import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { Loader2 } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoading } from '@/hooks';
import { toast } from '@/hooks/use-toast';
import { useIntl } from '@/i18n';

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

  const { handleSubmit, reset, setFocus } = form;
  const [loading, handleEvent, handleAction] = useLoading<TFormSchema>();
  useEffect(() => {
    handleAction(async (data: TFormSchema) => {
      await dataService.add({
        title: data.title,
        overdueAt: data.date?.valueOf(),
      });

      toast({ title: t('create-success'), duration: 1_000 });
      reset();
      setTimeout(() => {
        setFocus('title');
      }, 0);
    });
  }, [handleAction, setFocus]);

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
          {loading && <Loader2 className="animate-spin" />}
          {t('submit-form')}
        </Button>
      </form>
    </Form>
  );
};
