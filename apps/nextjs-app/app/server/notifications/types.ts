import type { ISystemDictionaryItem } from '@/services/api';
import type { IDBTodoItem } from '@/services/api';

export interface ITodoItemAddedEvent {
  type: 'add-todo';
  item: IDBTodoItem;
}

export interface ITodoItemUpdatedEvent {
  type: 'update-todo';
  item: IDBTodoItem;
}

export interface ITodoItemDeletedEvent {
  type: 'delete-todo';
  id: string;
}

export type TTodoItemChangedEvent = ITodoItemAddedEvent | ITodoItemUpdatedEvent | ITodoItemDeletedEvent;

export interface ISystemDictionaryUpdatedEvent {
  type: 'set-system-dictionary-item';
  item: ISystemDictionaryItem;
}

export type TItemChangedEvent = TTodoItemChangedEvent | ISystemDictionaryUpdatedEvent;

export interface IChangedItemInfo {
  clientId: string;
  data: TItemChangedEvent;
}
