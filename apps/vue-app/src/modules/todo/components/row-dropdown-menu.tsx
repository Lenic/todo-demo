import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/interface';
import { FilePenLine, Loader2, Trash2 } from 'lucide-vue-next';
import { filter, finalize, map } from 'rxjs';
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
import { useLoading, useObservableRef } from '@/hooks';
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

    const showRemoveDialogRef = ref(false);
    const openRemoveDialog = () => void (showRemoveDialogRef.value = true);
    const [loadingRef, handleRemove] = useLoading(() =>
      dataService.delete(props.id).pipe(finalize(() => void (showRemoveDialogRef.value = false))),
    );

    const openRef = ref(false);
    return () => (
      <>
        <DropdownMenu v-model:open={openRef.value}>
          <DropdownMenuTrigger class="leading-5 h-5 flex-initial">{slots.default?.(openRef.value)}</DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom">
            <DropdownMenuItem onClick={handleModify}>
              <FilePenLine class="h-4 w-4" />
              {t('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openRemoveDialog}>
              <Trash2 class="h-4 w-4" />
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
