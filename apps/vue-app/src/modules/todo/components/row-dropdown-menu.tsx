import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { Loader2 } from 'lucide-vue-next';
import { filter, map, take, tap } from 'rxjs';
import { defineComponent, ref } from 'vue';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLoading, useObservableRef, useUpdate } from '@/hooks';
import { useIntl } from '@/i18n';

const dataService = ServiceLocator.default.get(IDataService);

export const RowDropdownMenu = defineComponent({
  name: 'RowDropdownMenu',
  props: {
    id: { type: String, required: true },
  },
  emits: ['detail'],
  setup(props, { emit, slots }) {
    const { t } = useIntl('todo.item-dropdown-menu');

    const titleRef = useObservableRef(
      dataService.dataMapper$.pipe(
        map((mapper) => mapper[props.id]),
        filter((v) => !!v),
        map((item) => item.title),
      ),
      '--',
    );

    const handleModify = () => {
      emit('detail', props.id);
    };

    const refresh$ = useUpdate();
    const showRemoveDialogRef = ref(false);
    const openRemoveDialog = () => void (showRemoveDialogRef.value = true);
    const [loadingRef, handleRemove] = useLoading(() =>
      dataService
        .delete(props.id)
        .pipe(tap(() => refresh$.pipe(take(1)).subscribe(() => void (showRemoveDialogRef.value = false)))),
    );

    return () => (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger class="leading-5 h-5">{slots.default?.()}</DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom">
            <DropdownMenuItem inset onClick={handleModify}>
              {t('detail')}
            </DropdownMenuItem>
            <DropdownMenuItem inset onClick={openRemoveDialog}>
              {t('remove')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog v-model:open={showRemoveDialogRef.value}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('remove-dialog.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('remove-dialog.description', { val: titleRef.value })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loadingRef.value}>{t('remove-dialog.cancel')}</AlertDialogCancel>
              <Button variant="destructive" disabled={loadingRef.value} onClick={handleRemove}>
                {loadingRef.value && <Loader2 class="animate-spin" width={18} height={18} />}
                {t('remove')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
});
