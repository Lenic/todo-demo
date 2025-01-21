import { VirtualizedList } from '@/components/virtualized';

export const TodoList = () => {
  return (
    <VirtualizedList
      height={200}
      itemHeight={24}
      totalCount={100000}
      buffer={1}
      style={{
        'white-space': 'nowrap',
        width: '300px',
      }}
    >
      {(index) => (
        <div>
          {index} - {Date.now()}
        </div>
      )}
    </VirtualizedList>
  );
};
