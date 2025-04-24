import { Observable } from 'rxjs';

const getElementSize = (el: HTMLElement): [number, number] => {
  const rect = el.getBoundingClientRect();
  return [rect.width, rect.height];
};

export function listenResize$(el: HTMLElement | undefined) {
  return new Observable<[number, number]>((observer) => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length) {
        const entry = entries[0];
        observer.next([entry.contentRect.width, entry.contentRect.height]);
      }
    });

    if (el) {
      resizeObserver.observe(el);
      observer.next(getElementSize(el));
    }

    return () => {
      observer.complete();
      resizeObserver.disconnect();
    };
  });
}
