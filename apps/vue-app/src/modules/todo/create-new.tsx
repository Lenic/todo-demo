import type { IFieldRendererEventArgs } from './types';
import type { Observable } from 'rxjs';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { filter, map, switchMap, take, tap } from 'rxjs';
import { useForm } from 'vee-validate';
import { defineComponent } from 'vue';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useEvent, useLoading, useRef, useUpdate } from '@/hooks';
import { useIntl } from '@/i18n';

import { DatePicker } from './components/date-picker';

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

    const [handleBlur] = useEvent<FocusEvent>((e$) =>
      e$.pipe(
        map((e) => e.target as HTMLInputElement | null),
        filter((v) => !!v && !v.value),
        tap(() => {
          form.setFieldError('title', []);
        }),
      ),
    );

    const refresh$ = useUpdate();
    const [inputRef, input$] = useRef<{ el$: Observable<HTMLInputElement> }>();
    const [loadingRef, handleEvent] = useLoading((data: z.infer<typeof formSchema>) =>
      dataService.add({ title: data.title, overdueAt: data.date?.valueOf() }).pipe(
        tap(() => {
          toast({ title: t('create-success'), duration: 1_000 });
          form.resetForm();

          refresh$
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
      ),
    );

    const handleSubmit = (e: Event) => void form.handleSubmit(handleEvent)(e);
    return () => (
      <form class="h-[4.25rem] relative flex flex-row space-x-2" onSubmit={handleSubmit}>
        <FormField name="title">
          {({ field }: IFieldRendererEventArgs<string | undefined, string | number | undefined>) => (
            <FormItem class="flex-auto space-y-0">
              <FormControl>
                <Input
                  type="text"
                  ref={inputRef}
                  modelValue={field.value}
                  disabled={loadingRef.value}
                  placeholder={t('input-placeholder')}
                  onBlur={handleBlur}
                  onUpdate:modelValue={field['onUpdate:modelValue']}
                />
              </FormControl>
              <FormMessage class="absolute left-0 bottom-2 text-xs" />
            </FormItem>
          )}
        </FormField>
        <FormField name="date">
          {({ field }: IFieldRendererEventArgs<Date | null>) => (
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
