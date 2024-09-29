import type { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-[4.25rem] relative flex flex-row space-x-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem id="task-title">
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
