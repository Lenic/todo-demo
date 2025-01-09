import { ServiceLocator } from '@todo/container';
import { IDataService } from '@todo/controllers';
import { defineComponent, ref } from 'vue';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/toast';
import { useLoading, useObservableEffect } from '@/hooks';
import { useIntl } from '@/i18n';

const dataService = ServiceLocator.default.get(IDataService);

export const RowDropdownMenu = defineComponent({
  name: 'RowDropdownMenu',
  props: {
    id: { type: String, required: true },
  },
  emits: ['detail'],
  setup(props, { emit, slots }) {
    const { t } = useIntl('todo.item-context-menu');
    const [, handleRemove, loading$] = useLoading(() => dataService.delete(props.id));

    const idRef = ref('');
    const { toast, dismiss } = useToast();
    useObservableEffect(
      loading$.subscribe((loading) => {
        if (loading) {
          idRef.value = toast({ title: t('executing'), duration: 0 }).id;
        } else if (idRef.value) {
          dismiss(idRef.value);
          idRef.value = '';
        }
      }),
    );

    const handleModify = () => {
      emit('detail', props.id);
    };

    return () => (
      <DropdownMenu>
        <DropdownMenuTrigger class="leading-5 h-5">{slots.default?.()}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom">
          <DropdownMenuItem inset onClick={handleModify}>
            明细
          </DropdownMenuItem>
          <DropdownMenuItem inset onClick={handleRemove}>
            {t('remove')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});
