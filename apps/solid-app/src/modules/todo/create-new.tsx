import { toaster } from '@kobalte/core';
import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { Loader2 } from 'lucide-solid';
import { filter, map, switchMap, take, tap } from 'rxjs';
import { createSignal } from 'solid-js';

import { Button } from '@/components/ui/button';
import { TextField, TextFieldRoot } from '@/components/ui/textfield';
import { Toast, ToastContent, ToastProgress, ToastTitle } from '@/components/ui/toast';
import { useEvent, useLoading, useObservableRef, useUpdate } from '@/hooks';
import { useIntl } from '@/i18n';

const dataService = ServiceLocator.default.get(IDataService);

const getDefaultValue = () => ({ title: '', date: null as Date | null });

export const CreateNewTask = () => {
  const [error, setError] = createSignal('');
  const { t } = useIntl('todo.create-new');
  const [formValue, setFormValue] = createSignal(getDefaultValue());

  const [handleInput] = useEvent<InputEvent & { currentTarget: HTMLInputElement }>((e$) =>
    e$.pipe(
      map((e) => e.currentTarget.value),
      tap((value) => {
        setFormValue((prev) => ({ ...prev, title: value }));
        setError(value && value.length < 2 ? 'validation-rules.title-length' : '');
      }),
    ),
  );

  const [handleBlur] = useEvent<FocusEvent & { currentTarget: HTMLInputElement }>((e$) =>
    e$.pipe(
      map((e) => e.currentTarget.value),
      filter((v) => !v),
      tap(() => setError('')),
    ),
  );

  const refresh$ = useUpdate();
  const [setInput, input$] = useObservableRef<HTMLInputElement>();
  const [loading, handleSubmit] = useLoading<SubmitEvent & { currentTarget: HTMLFormElement }>((e) => {
    e.preventDefault();

    const data = formValue();
    return dataService.add({ title: data.title, overdueAt: data.date?.valueOf() }).pipe(
      tap(() => {
        toaster.show((props) => (
          <Toast toastId={props.toastId}>
            <ToastContent>
              <ToastTitle>{t('create-success')}</ToastTitle>
            </ToastContent>
            <ToastProgress />
          </Toast>
        ));
        setFormValue(getDefaultValue());

        refresh$
          .pipe(
            switchMap(() => input$),
            filter((v) => !!v),
            take(1),
          )
          .subscribe((el) => {
            el.focus();
          });
      }),
    );
  });

  return (
    <form class="h-[4.25rem] relative flex flex-row space-x-2" onSubmit={handleSubmit}>
      <div class="flex-auto">
        <TextFieldRoot class="w-full" disabled={loading()}>
          <TextField
            ref={setInput}
            value={formValue().title}
            placeholder={t('input-placeholder')}
            onBlur={handleBlur}
            onInput={handleInput}
          />
        </TextFieldRoot>
        {!error() ? null : <div class="absolute left-0 bottom-2 text-destructive text-xs">{t(error())}</div>}
      </div>
      <div class="flex-none">date picker</div>
      <Button size="lg" type="submit" class="flex-initial px-4" disabled={loading() || !!error()}>
        {loading() && <Loader2 class="animate-spin mr-2" width={18} height={18} />}
        {t('submit-form')}
      </Button>
    </form>
  );
};
// <DatePicker {...field} disabled={loading.value} />
