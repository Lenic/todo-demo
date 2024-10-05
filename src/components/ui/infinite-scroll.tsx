import type { FC, ReactNode } from 'react';

import { useEffect, useRef, useState } from 'react';

export interface IInfiniteScrollProps {
  loadMore(): Promise<void>;
  hasMore: boolean;
  children?: ReactNode[];
}

export const InfiniteScroll: FC<IInfiniteScrollProps> = ({ loadMore, hasMore, children }) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setIsFetching(true);
          loadMore().then(() => setIsFetching(false));
        }
      },
      { threshold: 1.0 },
    );

    const el = observerTarget.current;

    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [loadMore, hasMore, isFetching]);

  return (
    <>
      {children}
      {hasMore && <div ref={observerTarget}>Loading more...</div>}
    </>
  );
};

export default InfiniteScroll;
