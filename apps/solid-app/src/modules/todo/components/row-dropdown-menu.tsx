import type { JSX } from 'solid-js';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { FilePenLine, Loader2, Trash2 } from 'lucide-solid';
import { filter, finalize, map } from 'rxjs';
import { createSignal } from 'solid-js';

import {
  AlertDialog,
  AlertDialogClose,
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
import { useLoading, useObservableSignal } from '@/hooks';
import { useIntl } from '@/i18n';

const dataService = ServiceLocator.default.get(IDataService);

export interface RowDropdownMenuProps {
  id: string;
  onDetail?: (id: string) => void;
  children?: (open: boolean) => JSX.Element;
}

export const RowDropdownMenu = (props: RowDropdownMenuProps) => {
  const { t } = useIntl('todo.item-dropdown-menu');

  const title = useObservableSignal(
    dataService.dataMapper$.pipe(
      map((mapper) => mapper[props.id]),
      filter((v) => !!v),
      map((item) => item.title),
    ),
    '--',
  );

  const handleModify = () => props.onDetail?.(props.id);

  const [showRemoveDialog, setShowRemoveDialog] = createSignal(false);
  const openRemoveDialog = () => void setShowRemoveDialog(true);
  const [loading, handleRemove] = useLoading(() =>
    dataService.delete(props.id).pipe(finalize(() => void setShowRemoveDialog(false))),
  );

  const [open, setOpen] = createSignal(false);
  return (
    <>
      <DropdownMenu placement="bottom-start" open={open()} onOpenChange={setOpen}>
        <DropdownMenuTrigger class="leading-5 h-5 flex-initial">{props.children?.(open())}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleModify}>
            <FilePenLine class="h-4 w-4 mr-2" />
            {t('edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openRemoveDialog}>
            <Trash2 class="h-4 w-4 mr-2" />
            {t('remove')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showRemoveDialog()} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('remove-dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('remove-dialog.description', { val: title() })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose disabled={loading()}>{t('remove-dialog.cancel')}</AlertDialogClose>
            <Button variant="destructive" disabled={loading()} onClick={handleRemove}>
              {loading() && <Loader2 class="animate-spin mr-2" width={18} height={18} />}
              {t('remove')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
