import type { IFieldRendererEventArgs } from './types';

import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/interface';
import { toTypedSchema } from '@vee-validate/zod';
import { Loader2 } from 'lucide-vue-next';
import { useId } from 'radix-vue';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, filter, finalize, map, take } from 'rxjs/operators';
import { useForm } from 'vee-validate';
import { defineComponent, ref } from 'vue';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { useLoading, useObservableEffect } from '@/hooks';
import { useIntl } from '@/i18n';

import { DatePicker } from './components/date-picker';

const dataService = ServiceLocator.default.get(IDataService);

export const TodoItemEditor = defineComponent({
  name: 'TodoItemEditor',
  props: {
    id: { type: String, required: true },
    open: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  setup(props, { emit }) {
    const { t, n } = useIntl('todo.editor');

    const formSchema = z.object({
      title: z.string().min(2, { message: n('validation-rules.title-length') }),
      description: z.string(),
      date: z.date().nullable(),
      checked: z.boolean(),
    });

    const form = useForm({
      keepValuesOnUnmount: true,
      validationSchema: toTypedSchema(formSchema),
      initialValues: { title: '', description: '', checked: false, date: null as null | Date },
    });

    const isSubmissionForbiddenRef = ref(false);

    useObservableEffect(
      dataService.dataMapper$
        .pipe(
          map((mapper) => mapper[props.id]),
          filter((item) => !!item),
        )
        .subscribe((item) => {
          isSubmissionForbiddenRef.value = item.status === ETodoStatus.DONE;
          form.resetForm({
            values: {
              title: item.title,
              description: item.description ?? '',
              checked: item.status === ETodoStatus.DONE,
              date: item.overdueAt ? new Date(item.overdueAt) : null,
            },
          });
        }),
    );

    const handleClose = () => {
      form.resetForm();
      emit('update:open', false);
    };

    const [loadingRef, handleEvent] = useLoading((data: z.infer<typeof formSchema>) =>
      dataService.dataMapper$.pipe(
        map((mapper) => mapper[props.id]),
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
            .pipe(
              finalize(() => {
                toast({ title: t('update-success'), duration: 1_000 });
                emit('update:open', false);
              }),
              catchError(() => {
                toast({ title: t('update-failure'), duration: 0 });
                return EMPTY;
              }),
            ),
        ),
      ),
    );
    const handleSubmit = (e: Event) => void form.handleSubmit(handleEvent)(e);

    const checkboxKey = useId();
    return () => (
      <Dialog open={props.open} onUpdate:open={handleClose}>
        <DialogContent class="max-md:w-full max-md:inset-0 max-md:top-[unset] max-md:transform-none">
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{t('title')}</DialogDescription>
          <form class="flex flex-col space-y-2" onSubmit={handleSubmit}>
            <div class="flex flex-row space-x-2 justify-between items-center">
              <FormField name="checked">
                {({ field }: IFieldRendererEventArgs<boolean | undefined>) => (
                  <FormItem>
                    <FormControl>
                      <div class="flex items-center space-x-2">
                        <Checkbox
                          id={checkboxKey}
                          checked={field.value}
                          onUpdate:checked={field['onUpdate:modelValue']}
                          disabled={isSubmissionForbiddenRef.value}
                        />
                        <Label htmlFor={checkboxKey} class="cursor-pointer">
                          {field.value ? t('status.done') : t('status.pending')}
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              </FormField>
              <FormField name="date">
                {({ field }: IFieldRendererEventArgs<Date | null>) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmissionForbiddenRef.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              </FormField>
            </div>
            <FormField name="title">
              {({ field }: IFieldRendererEventArgs<string | undefined, string | number | undefined>) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      modelValue={field.value}
                      placeholder={t('title-placeholder')}
                      disabled={isSubmissionForbiddenRef.value}
                      onUpdate:modelValue={field['onUpdate:modelValue']}
                    />
                  </FormControl>
                  <FormMessage class="absolute left-0 bottom-0" />
                </FormItem>
              )}
            </FormField>
            <FormField name="description">
              {({ field }: IFieldRendererEventArgs<string | undefined, string | number | undefined>) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={6}
                      modelValue={field.value}
                      disabled={isSubmissionForbiddenRef.value}
                      placeholder={t('description-placeholder')}
                      onUpdate:modelValue={field['onUpdate:modelValue']}
                    />
                  </FormControl>
                  <FormMessage class="absolute left-0 bottom-0" />
                </FormItem>
              )}
            </FormField>
            <DialogFooter class="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={loadingRef.value || isSubmissionForbiddenRef.value}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={loadingRef.value || isSubmissionForbiddenRef.value}>
                {loadingRef.value && <Loader2 class="animate-spin mr-2" width={18} height={18} />}
                {t('submit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
});
