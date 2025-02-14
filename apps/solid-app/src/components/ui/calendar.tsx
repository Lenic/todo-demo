import type { DatePickerContentProps, DateValue } from '@ark-ui/solid/date-picker';

import { CalendarDate } from '@internationalized/date';
import dayjs from 'dayjs';
import { createMemo, For, splitProps } from 'solid-js';

import { useObservableSignal } from '@/hooks';
import { ELocaleType, i18n } from '@/i18n';

import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from './date-picker';

export interface CalendarProps extends Omit<DatePickerContentProps, 'onChange'> {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
}

export const Calendar = (props: CalendarProps) => {
  const [local, rest] = splitProps(props, ['value', 'defaultValue', 'onChange']);
  const locale = useObservableSignal(i18n.language$, ELocaleType.EN_US);

  const defaultValue = createMemo(() => {
    if (local.defaultValue) return undefined;

    const currentDate = dayjs(local.defaultValue);
    return [new CalendarDate(currentDate.year(), currentDate.month() + 1, currentDate.date())];
  });

  const value = createMemo(() => {
    if (!local.value) return undefined;

    const currentDate = dayjs(local.value);
    return [new CalendarDate(currentDate.year(), currentDate.month() + 1, currentDate.date())];
  });

  const handleChangeDate = (e: { value: DateValue[] }) => {
    local.onChange?.(!e.value.length ? null : dayjs(e.value[0].toString()).valueOf());
  };

  return (
    <DatePicker open value={value()} defaultValue={defaultValue()} locale={locale()} onValueChange={handleChangeDate}>
      <DatePickerContent {...rest}>
        <DatePickerView view="day">
          <DatePickerContext>
            {(context) => (
              <>
                <DatePickerViewControl>
                  <DatePickerViewTrigger>
                    <DatePickerRangeText />
                  </DatePickerViewTrigger>
                </DatePickerViewControl>
                <DatePickerTable>
                  <DatePickerTableHead>
                    <DatePickerTableRow>
                      <For each={context().weekDays}>
                        {(weekDay) => <DatePickerTableHeader>{weekDay.short}</DatePickerTableHeader>}
                      </For>
                    </DatePickerTableRow>
                  </DatePickerTableHead>
                  <DatePickerTableBody>
                    <For each={context().weeks}>
                      {(week) => (
                        <DatePickerTableRow>
                          <For each={week}>
                            {(day) => (
                              <DatePickerTableCell value={day}>
                                <DatePickerTableCellTrigger>{day.day}</DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            )}
                          </For>
                        </DatePickerTableRow>
                      )}
                    </For>
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>
        <DatePickerView view="month">
          <DatePickerContext>
            {(context) => (
              <>
                <DatePickerViewControl>
                  <DatePickerViewTrigger>
                    <DatePickerRangeText />
                  </DatePickerViewTrigger>
                </DatePickerViewControl>
                <DatePickerTable>
                  <DatePickerTableBody>
                    <For
                      each={context().getMonthsGrid({
                        columns: 4,
                        format: 'short',
                      })}
                    >
                      {(months) => (
                        <DatePickerTableRow>
                          <For each={months}>
                            {(month) => (
                              <DatePickerTableCell value={month.value}>
                                <DatePickerTableCellTrigger>{month.label}</DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            )}
                          </For>
                        </DatePickerTableRow>
                      )}
                    </For>
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>
        <DatePickerView view="year">
          <DatePickerContext>
            {(context) => (
              <>
                <DatePickerViewControl>
                  <DatePickerViewTrigger>
                    <DatePickerRangeText />
                  </DatePickerViewTrigger>
                </DatePickerViewControl>
                <DatePickerTable>
                  <DatePickerTableBody>
                    <For
                      each={context().getYearsGrid({
                        columns: 4,
                      })}
                    >
                      {(years) => (
                        <DatePickerTableRow>
                          <For each={years}>
                            {(year) => (
                              <DatePickerTableCell value={year.value}>
                                <DatePickerTableCellTrigger>{year.label}</DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            )}
                          </For>
                        </DatePickerTableRow>
                      )}
                    </For>
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>
      </DatePickerContent>
    </DatePicker>
  );
};
