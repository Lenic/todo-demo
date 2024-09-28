import type { FC } from 'react';

import { TodoItem } from './item';

export interface ITodoListProps {
  ids: string[];
}

export const TodoList: FC<ITodoListProps> = ({ ids }) => {
  return (
    <div className="flex flex-col space-y-2">
      {ids.map((id) => (
        <TodoItem key={id} id={id} />
      ))}
    </div>
  );
};
