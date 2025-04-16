import type { ITodoItem } from '@todo/interface';

import { toaster } from '@kobalte/core';
import { ServiceLocator } from '@todo/container';
import { ETodoStatus, IDataService } from '@todo/interface';
import { Loader2 } from 'lucide-solid';
import {
  catchError,
  concatMap,
  EMPTY,
  filter,
  finalize,
  from,
  map,
  merge,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { createSignal, observable } from 'solid-js';

import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxControl, CheckboxLabel } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TextArea } from '@/components/ui/textarea';
import { TextField, TextFieldRoot } from '@/components/ui/textfield';
import { Toast, ToastContent, ToastProgress, ToastTitle } from '@/components/ui/toast';
import { useEvent, useLoading, useObservableEffect } from '@/hooks';
import { useIntl } from '@/i18n';

import { DatePicker } from './components/date-picker';

export interface TodoItemEditorProps {
  id: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const dataService = ServiceLocator.default.get(IDataService);

const getDefaultValue = () => ({ title: '', description: '', checked: false, date: null as null | number });

type TFormValue = ReturnType<typeof getDefaultValue>;

const convertToFormValue = (item: ITodoItem) => ({
  title: item.title,
  description: item.description ?? '',
  checked: item.status === ETodoStatus.DONE,
  date: item.overdueAt ?? null,
});

export const TodoItemEditor = (props: TodoItemEditorProps) => {
  const { t } = useIntl('todo.editor');
  const [error, setError] = createSignal('');
  const [formValue, setFormValue] = createSignal(getDefaultValue());

  const handleUpdateFormValue = <T extends keyof TFormValue>(key: T, value: TFormValue[T]) => {
    setFormValue((prev) => ({ ...prev, [key]: value }));
  };

  const [handleInput] = useEvent<InputEvent & { currentTarget: HTMLInputElement }>((e$) =>
    e$.pipe(
      map((e) => e.currentTarget.value),
      tap((title) => {
        setFormValue((prev) => ({ ...prev, title }));
        setError(title && title.length < 2 ? 'validation-rules.title-length' : '');
      }),
    ),
  );

  const [canSubmit, setCanSubmit] = createSignal(false);

  const item$ = dataService.dataMapper$.pipe(
    map((mapper) => mapper[props.id]),
    filter((item) => !!item),
    shareReplay(1),
  );

  useObservableEffect(
    merge(
      item$,
      from(observable(() => props.open)).pipe(filter((v) => !v)),
      from(observable(canSubmit)).pipe(filter((v) => !v)),
    )
      .pipe(switchMap(() => item$))
      .subscribe((item) => {
        setFormValue(convertToFormValue(item));
        setCanSubmit(item.status === ETodoStatus.DONE);
      }),
  );

  const handleClose = () => props.onOpenChange?.(false);

  const [loading, handleSubmit] = useLoading<SubmitEvent & { currentTarget: HTMLFormElement }>((e) => {
    e.preventDefault();

    const data = formValue();
    if (!data.title) return EMPTY;

    return dataService.dataMapper$.pipe(
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
              toaster.show((props) => (
                <Toast toastId={props.toastId}>
                  <ToastContent>
                    <ToastTitle>{t('update-success')}</ToastTitle>
                  </ToastContent>
                  <ToastProgress />
                </Toast>
              ));
              handleClose();
            }),
            catchError(() => {
              toaster.show((props) => (
                <Toast toastId={props.toastId} duration={5000}>
                  <ToastContent>
                    <ToastTitle>{t('update-failure')}</ToastTitle>
                  </ToastContent>
                </Toast>
              ));
              return EMPTY;
            }),
          ),
      ),
    );
  });

  return (
    <Dialog open={props.open ?? false} onOpenChange={handleClose}>
      <DialogContent class="max-md:w-full max-md:inset-0 max-md:top-[unset] max-md:transform-none">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t('title')}</DialogDescription>
        <form class="flex flex-col space-y-2" onSubmit={handleSubmit}>
          <div class="flex flex-row space-x-2 justify-between items-center">
            <div class="flex items-center space-x-2">
              <Checkbox
                class="flex items-center space-x-2"
                checked={formValue().checked}
                disabled={canSubmit()}
                onChange={(checked) => {
                  handleUpdateFormValue('checked', checked);
                }}
              >
                <CheckboxControl />
                <CheckboxLabel class="cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
                  {formValue().checked ? t('status.done') : t('status.pending')}
                </CheckboxLabel>
              </Checkbox>
            </div>
            <DatePicker
              disabled={canSubmit()}
              value={formValue().date}
              onChange={(date) => {
                handleUpdateFormValue('date', date);
              }}
            />
          </div>
          <TextFieldRoot class="relative w-full" disabled={canSubmit()}>
            <TextField value={formValue().title} placeholder={t('title-placeholder')} onInput={handleInput} />
            {!error() ? null : <div class="text-destructive text-xs">{t(error())}</div>}
          </TextFieldRoot>
          <TextFieldRoot class="w-full" disabled={canSubmit()}>
            <TextArea
              rows={6}
              value={formValue().description}
              placeholder={t('description-placeholder')}
              onInput={(e) => {
                handleUpdateFormValue('description', e.currentTarget.value.trim());
              }}
            />
          </TextFieldRoot>
          <DialogFooter class="grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading()}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={canSubmit() || loading()}>
              {loading() && <Loader2 class="animate-spin mr-2" width={18} height={18} />}
              {t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
