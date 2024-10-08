import type { IDisposable } from './types';
import type { SubscriptionLike } from 'rxjs';

import { injectable } from 'inversify';

@injectable()
class Disposable implements IDisposable {
  private list: Array<(() => void) | SubscriptionLike> = [];

  dispose(): void {
    this.list.forEach((action) => (typeof action === 'function' ? action() : action.unsubscribe()));
  }

  protected disposeWithMe(subscription: (() => void) | SubscriptionLike) {
    this.list.push(subscription);
  }
}

export { Disposable };
