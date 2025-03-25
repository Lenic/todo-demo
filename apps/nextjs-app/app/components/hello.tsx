'use client';

import type { ITodoItem } from '@todo/controllers';

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';

export function Hello() {
  const handleClick = useCallback(() => {
    trpc.todo.list.query({}).then(
      (result) => {
        console.table(result);
      },
      (e: unknown) => {
        console.error(e);
      },
    );
  }, []);

  const [lastItem, setLastItem] = useState<ITodoItem | null>(null);
  const handleInsert = useCallback(() => {
    trpc.todo.add.mutate({ title: 'abc' }).then(
      (result) => {
        console.table(result);
        setLastItem(result);
      },
      (e: unknown) => {
        console.error(e);
      },
    );
  }, []);

  const handleUpdate = useCallback(() => {
    if (!lastItem) return;

    trpc.todo.update
      .mutate({
        ...lastItem,
        title: `${lastItem.title}${(Date.now() % 7).toString()}`,
      })
      .then(
        (result) => {
          console.table(result);
          setLastItem(result);
        },
        (e: unknown) => {
          console.error(e);
        },
      );
  }, [lastItem]);

  const handleDelete = useCallback(() => {
    if (!lastItem) return;

    trpc.todo.delete.mutate(lastItem.id).then(
      () => {
        console.log('delete finished.');
      },
      (e: unknown) => {
        console.error(e);
      },
    );
  }, [lastItem]);

  return (
    <div className="flex flex-col gap-2">
      <div>Hello Component</div>
      <div className="flex gap-2">
        <Button onClick={handleClick}>Get Todo List</Button>
        <Button onClick={handleInsert}>Insert New Todo</Button>
        <Button onClick={handleUpdate}>Update Last Todo</Button>
        <Button onClick={handleDelete}>Delete Last Todo</Button>
      </div>
    </div>
  );
}
