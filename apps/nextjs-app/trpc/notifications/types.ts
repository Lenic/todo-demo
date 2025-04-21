import type { ISystemDictionaryItem } from '@/services/api';
import type { ITodoItem } from '@todo/interface';

export interface ITodoItemAddedEvent {
  type: 'add-todo';
  item: ITodoItem;
}

export interface ITodoItemUpdateedEvent {
  type: 'update-todo';
  item: ITodoItem;
}

export interface ITodoItemDeletedEvent {
  type: 'delete-todo';
  id: string;
}

export type TTodoItemChangedEvent = ITodoItemAddedEvent | ITodoItemUpdateedEvent | ITodoItemDeletedEvent;

export interface ISystemDictionaryUpdatedEvent {
  type: 'set-system-dictionary-item';
  item: ISystemDictionaryItem;
}

export type TItemChangedEvent = TTodoItemChangedEvent | ISystemDictionaryUpdatedEvent;

export interface IChangedItemInfo {
  clientId: string;
  data: TItemChangedEvent;
}
