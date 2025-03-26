import type { ITodoItem } from '@todo/controllers';

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

export type TItemChangedEvent = TTodoItemChangedEvent;

export interface IChangedItemInfo {
  clientId: string;
  data: TItemChangedEvent;
}
