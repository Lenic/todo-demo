import type { IDisposable, SubscriptionLike } from './types';

import { injectable } from 'inversify';

@injectable()
class Disposable implements IDisposable {
  private subscriptionList: ((() => void) | SubscriptionLike)[] = [];

  dispose(): void {
    this.subscriptionList.forEach((action) => {
      if (typeof action === 'function') {
        action();
      } else {
        action.unsubscribe();
      }
    });
  }

  protected disposeWithMe(subscription: (() => void) | SubscriptionLike) {
    this.subscriptionList.push(subscription);
  }
}

export { Disposable };
