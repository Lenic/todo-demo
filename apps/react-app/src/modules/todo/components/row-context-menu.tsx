import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { type FC, type ReactNode, useEffect, useRef } from 'react';

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useLoading } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { useIntl } from '@/i18n';

export interface IRowContextMenuProps {
  id: string;
  children: ReactNode;
}

const dataService = ServiceLocator.default.get(IDataService);

export const RowContextMenu: FC<IRowContextMenuProps> = ({ id, children }) => {
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

  return (
    <ContextMenu>
      <ContextMenuTrigger className="leading-5 h-5">{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset onClick={handleRemove}>
          {t('remove')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
