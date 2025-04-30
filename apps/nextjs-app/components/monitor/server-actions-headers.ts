import { firstValueFrom } from 'rxjs';

import { socketIdSubject } from './constants';

// add socket id header to server actions
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (
      init?.headers instanceof Object &&
      'Accept' in init.headers &&
      init.headers.Accept === 'text/x-component' &&
      'Next-Action' in init.headers
    ) {
      const socketId = await firstValueFrom(socketIdSubject);
      return await originalFetch(input, {
        ...init,
        headers: { ...init.headers, 'Socket-Id': socketId },
      });
    }

    return await originalFetch(input, init);
  };
}
