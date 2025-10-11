import type { IDisposable, ISubscription } from './types';

class Disposable implements IDisposable {
  private subscriptionList: ((() => void) | ISubscription)[] = [];

  disposed = false;

  dispose(): void {
    if (this.disposed) return;

    this.subscriptionList.forEach((action) => {
      if (typeof action === 'function') {
        action();
      } else {
        action.unsubscribe();
      }
    });
    this.disposed = true;
  }

  protected disposeWithMe(subscription: (() => void) | ISubscription) {
    this.subscriptionList.push(subscription);
  }
}

export { Disposable };
