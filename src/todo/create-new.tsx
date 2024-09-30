import { useMemo, type FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { nanoid } from 'nanoid';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { DatePicker } from './components/date-picker';
import { ServiceLocator } from '@/lib/injector';
import { ETodoStatus, IDataService } from '@/resources';

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

  const dataService = useMemo(() => ServiceLocator.default.get(IDataService), []);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const now = Date.now();
    dataService.addOrUpdate({
      id: nanoid(),
      createdAt: now,
      status: ETodoStatus.PENDING,
      title: data.title,
      updatedAt: now,
      overdueAt: data.date?.valueOf(),
    });

    toast({ title: 'New task created.' });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-[4.25rem] relative flex flex-row space-x-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Input your task title" {...field} />
              </FormControl>
              <FormMessage className="absolute left-0 bottom-0" />
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
