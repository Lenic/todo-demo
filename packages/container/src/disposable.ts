import type { IDisposable, ISubscription } from './types';

class Disposable implements IDisposable {
  private subscriptionList: ((() => void) | ISubscription)[] = [];

  dispose(): void {
    this.subscriptionList.forEach((action) => {
      if (typeof action === 'function') {
        action();
      } else {
        action.unsubscribe();
      }
    });
  }

  protected disposeWithMe(subscription: (() => void) | ISubscription) {
    this.subscriptionList.push(subscription);
  }
}

export { Disposable };
