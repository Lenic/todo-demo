import { firstValueFrom } from 'rxjs';

import { SOCKET_ID_HEADER_KEY } from '@/constants';

import { socketIdSubject } from './constants';

// add socket id header to server actions
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.headers instanceof Object) {
      if ('Accept' in init.headers && init.headers.Accept === 'text/x-component' && 'Next-Action' in init.headers) {
        const socketId = await firstValueFrom(socketIdSubject);
        return await originalFetch(input, {
          ...init,
          headers: { ...init.headers, [SOCKET_ID_HEADER_KEY]: socketId },
        });
      }
    }

    return await originalFetch(input, init);
  };
}
