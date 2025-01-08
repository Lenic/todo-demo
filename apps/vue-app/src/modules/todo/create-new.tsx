import type { Observable } from 'rxjs';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { asyncScheduler, filter, finalize, observeOn, switchMap, take, tap } from 'rxjs';
import { useForm } from 'vee-validate';
import { defineComponent } from 'vue';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useLoading, useObservableEffect, useRef } from '@/hooks';
import { language$, useIntl } from '@/i18n';

// import { DatePicker } from './components/date-picker';

interface IFieldRenderer<T, TUpdateModel = T> {
  field: {
    name: string;
    modelValue: T | undefined;
    onBlur: (e: Event) => void;
    onChange: (e: Event) => void;
    onInput: (e: Event) => void;
    'onUpdate:modelValue': (value: TUpdateModel | undefined) => void;
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

    useObservableEffect(
      language$.subscribe(() => {
        form.setFieldError('title', []);
      }),
    );

    const [inputRef, input$] = useRef<{ el$: Observable<HTMLInputElement> }>();
    const [loadingRef, handleEvent] = useLoading((data: z.infer<typeof formSchema>) => {
      return dataService.add({ title: data.title, overdueAt: data.date?.valueOf() }).pipe(
        tap(() => {
          toast({ title: t('create-success'), duration: 1_000 });
          form.resetForm();
        }),
        finalize(() => {
          input$
            .pipe(
              filter((v) => !!v),
              switchMap((v) => v.el$),
              take(1),
              observeOn(asyncScheduler),
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
        <FormField
          name="title"
          v-slots={{
            default: ({ field }: IFieldRenderer<string, string | number>) => (
              <FormItem>
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
            ),
          }}
        />
        <FormField
          name="date"
          v-slots={{
            default: ({ field }: IFieldRenderer<string, string | number>) => (
              <FormItem class="flex-initial">
                <FormControl>
                  <Input type="text" {...field} placeholder={t('input-placeholder')} disabled={loadingRef.value} />
                </FormControl>
              </FormItem>
            ),
          }}
        />
        <Button type="submit" class="flex-initial" disabled={loadingRef.value}>
          {loadingRef.value && <Loader2 class="animate-spin mr-2" width={18} height={18} />}
          {t('submit-form')}
        </Button>
      </form>
    );
  },
});

// <DatePicker value={field.value} onChange={field.onChange} disabled={loading} />
