import type { IDisposable, ISubscription } from './types';

/**
 * Disposable class
 */
class Disposable implements IDisposable {
  /**
   * The list of the subscriptions
   */
  private subscriptionList: ((() => void) | ISubscription)[] = [];

  disposed = false;

  /**
   * Dispose the disposable
   */
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

  /**
   * Dispose with me
   * @param subscription - The subscription to dispose
   */
  protected disposeWithMe(subscription: (() => void) | ISubscription) {
    this.subscriptionList.push(subscription);
  }
}

export { Disposable };
