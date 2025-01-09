import type { Observable } from 'rxjs';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { filter, switchMap, take, tap } from 'rxjs';
import { useForm } from 'vee-validate';
import { defineComponent } from 'vue';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useLoading, useRef, useUpdate } from '@/hooks';
import { useIntl } from '@/i18n';

import { DatePicker } from './components/date-picker';

interface IFieldRenderer<T, TUpdateModel = T> {
  field: {
    value: T;
    name: string;
    onBlur: (e: Event) => void;
    onChange: (e: Event) => void;
    onInput: (e: Event) => void;
    'onUpdate:modelValue': (value: TUpdateModel) => void;
  };
}

const dataService = ServiceLocator.default.get(IDataService);

export const CreateNewTask = defineComponent({
  name: 'CreateNewTask',
  setup() {
    const { t, n } = useIntl('todo.create-new');

    const formSchema = z.object({
      title: z.string().min(2, { message: n('validation-rules.title-length') }),
      date: z.date().nullable(),
    });

    const form = useForm({
      validationSchema: toTypedSchema(formSchema),
      initialValues: { title: '', date: null },
    });

    const update$ = useUpdate();
    const [inputRef, input$] = useRef<{ el$: Observable<HTMLInputElement> }>();
    const [loadingRef, handleEvent] = useLoading((data: z.infer<typeof formSchema>) => {
      return dataService.add({ title: data.title, overdueAt: data.date?.valueOf() }).pipe(
        tap(() => {
          toast({ title: t('create-success'), duration: 1_000 });
          form.resetForm();

          update$
            .pipe(
              switchMap(() => input$),
              filter((v) => !!v),
              switchMap((v) => v.el$),
              take(1),
            )
            .subscribe((el) => {
              el.focus();
            });
        }),
      );
    });

    const handleSubmit = (e: Event) => void form.handleSubmit(handleEvent)(e);
    return () => (
      <form class="h-[4.25rem] relative flex flex-row space-x-2" onSubmit={handleSubmit}>
        <FormField name="title">
          {({ field }: IFieldRenderer<string | undefined, string | number | undefined>) => (
            <FormItem class="flex-auto">
              <FormControl>
                <Input
                  ref={inputRef}
                  type="text"
                  {...field}
                  placeholder={t('input-placeholder')}
                  disabled={loadingRef.value}
                />
              </FormControl>
              <FormMessage class="absolute left-0 bottom-0" />
            </FormItem>
          )}
        </FormField>
        <FormField name="date">
          {({ field }: IFieldRenderer<Date | null>) => (
            <FormItem class="flex-none">
              <FormControl>
                <DatePicker {...field} disabled={loadingRef.value} />
              </FormControl>
            </FormItem>
          )}
        </FormField>
        <Button size="lg" type="submit" class="flex-initial px-4" disabled={loadingRef.value || !form.meta.value.valid}>
          {loadingRef.value && <Loader2 class="animate-spin" width={18} height={18} />}
          {t('submit-form')}
        </Button>
      </form>
    );
  },
});
