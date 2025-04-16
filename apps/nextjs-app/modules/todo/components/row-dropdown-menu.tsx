import type { FC, ReactNode } from 'react';

import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { FilePenLine, Loader2, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { filter, finalize, map } from 'rxjs';

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
import { useLoading, useObservableState } from '@/hooks';
import { useIntl } from '@/i18n';

export interface IRowDropdownMenuProps {
  id: string;
  children: (open: boolean) => ReactNode;
  onDetail?: (id: string) => void;
}

const dataService = ServiceLocator.default.get(IDataService);

export const RowDropdownMenu: FC<IRowDropdownMenuProps> = ({ id, children, onDetail }) => {
  const { t } = useIntl('todo.item-context-menu');

  const title = useObservableState(
    useMemo(
      () =>
        dataService.dataMapper$.pipe(
          map((mapper) => mapper[id]),
          filter((v) => !!v),
          map((item) => item.title),
        ),
      [id],
    ),
    '',
  );

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const handleOpenDialog = useCallback(() => {
    setShowRemoveDialog(true);
  }, []);
  const handleCloseDialog = useCallback(() => {
    setShowRemoveDialog(false);
  }, []);
  const [loading, handleRemove] = useLoading(() => dataService.delete(id).pipe(finalize(handleCloseDialog)));

  const handleModify = useCallback(() => {
    onDetail?.(id);
  }, [onDetail, id]);

  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="leading-5 h-5">{children(open)}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom">
          <DropdownMenuItem onClick={handleModify}>
            <FilePenLine className="h-4 w-4 mr-2" />
            {t('edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenDialog}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t('remove')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('remove-dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('remove-dialog.description', { val: title })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>{t('remove-dialog.cancel')}</AlertDialogCancel>
            <Button variant="destructive" disabled={loading} onClick={handleRemove}>
              {loading && <Loader2 className="animate-spin mr-2" width={18} height={18} />}
              {t('remove')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
