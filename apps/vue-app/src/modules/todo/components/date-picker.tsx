import type { DateValue } from '@internationalized/date';
import type { PropType } from 'vue';

import { CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { computed, defineComponent, ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIntl } from '@/i18n';
import { cn } from '@/lib/utils';

export const DatePicker = defineComponent({
  name: 'DatePicker',
  props: {
    value: { type: Object as PropType<Date | null>, default: null },
    disabled: { type: Boolean, default: false },
    className: { type: String, default: '' },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const openRef = ref(false);
    const handleChangeDate = (value?: DateValue) => {
      openRef.value = false;
      emit('change', value ? dayjs(value.toString()).toDate() : null);
    };

    const calendarValueRef = computed(() => {
      if (!props.value) return undefined;

      const currentDate = dayjs(props.value);
      return new CalendarDate(currentDate.year(), currentDate.month(), currentDate.date());
    });

    const { t } = useIntl('todo.date-picker');
    const placeholderRef = computed(() => (props.value ? dayjs(props.value).format(t('date-formatter')) : null));
    return () => (
      <Popover v-model:open={openRef.value}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            disabled={props.disabled}
            class={cn(
              'w-[8.75rem] justify-start text-left font-normal px-4',
              !props.value && 'text-muted-foreground',
              props.className,
            )}
          >
            <CalendarIcon class="h-4 w-4" />
            {placeholderRef.value ?? <span>{t('placeholder')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar multiple={false} modelValue={calendarValueRef.value} onUpdate:modelValue={handleChangeDate} />
        </PopoverContent>
      </Popover>
    );
  },
});
