import type { ISystemDictionaryItem } from '../../services/api';

export interface ISystemDictionaryUpdatedEvent {
  type: 'set-system-dictionary-item';
  item: ISystemDictionaryItem;
}

export type TItemChangedEvent = ISystemDictionaryUpdatedEvent;

export interface IChangedItemInfo {
  clientId: string;
  data: TItemChangedEvent;
}
