import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { FilePenLine, Trash2 } from 'lucide-react';
import { type FC, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLoading } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { useIntl } from '@/i18n';

export interface IRowDropdownMenuProps {
  id: string;
  children: (open: boolean) => ReactNode;
  onDetail?: (id: string) => void;
}

const dataService = ServiceLocator.default.get(IDataService);

export const RowDropdownMenu: FC<IRowDropdownMenuProps> = ({ id, children, onDetail }) => {
  const { t } = useIntl('todo.item-context-menu');
  const [, handleRemove, loading$] = useLoading(() => dataService.delete(id));

  const idRef = useRef('');
  const { toast, dismiss } = useToast();
  useEffect(() => {
    const subscription = loading$.subscribe((loading) => {
      if (loading) {
        idRef.current = toast({ title: t('executing'), duration: 0 }).id;
      } else if (idRef.current) {
        dismiss(idRef.current);
        idRef.current = '';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loading$, t, dismiss, toast]);

  const handleModify = useCallback(() => {
    onDetail?.(id);
  }, [id, onDetail]);

  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="leading-5 h-5">{children(open)}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem onClick={handleModify}>
          <FilePenLine className="h-4 w-4 mr-2" />
          {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRemove}>
          <Trash2 className="h-4 w-4 mr-2" />
          {t('remove')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
