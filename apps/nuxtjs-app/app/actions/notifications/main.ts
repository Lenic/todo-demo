import { map, of } from 'rxjs';

// let pusher: Pusher | null = null;
// const pusher$ = defer(() => {
//   if (pusher) return of(pusher);
//
//   const runtimeConfig = useRuntimeConfig();
//
//   pusher = new Pusher({
//     appId: runtimeConfig.pusherId,
//     key: runtimeConfig.public.pusherKey,
//     secret: runtimeConfig.pusherSecret,
//     cluster: runtimeConfig.public.pusherCluster,
//     useTLS: true,
//   });
//
//   return of(pusher);
// });

export const publish = () => of('7224a0ad-af31-4c71-81ed-7d3ef0a9423d').pipe(map((userId) => ({ userId })));

// export const publish = () => {
//   const headers = useRequestHeaders();
//   return zip([
//     of(headers).pipe(
//       map((headers) => {
//         console.log('headers length', Object.keys(headers).length);
//         return '7224a0ad-af31-4c71-81ed-7d3ef0a9423d';
//       }),
//     ),
//     of(headers).pipe(map((store) => store[SOCKET_ID_HEADER_KEY] ?? '')),
//   ]).pipe(
//     map(([userId, clientId]) => ({
//       userId,
//       sync: <T>(data: TItemChangedEvent, result: T) => {
//         if (!clientId) {
//           throw new Error('[Request Headers]: can not find the client id.');
//         }
//
//         const v: IChangedItemInfo = { clientId, data };
//
//         return pusher$.pipe(
//           concatMap((pusher) =>
//             from(
//               pusher.trigger(userId, PUSHER_EVENT, v, { socket_id: clientId }).catch((e: unknown) => {
//                 console.log('[Pusher Error]: push new message error.', v, e);
//               }),
//             ),
//           ),
//           map(() => result),
//         );
//       },
//     })),
//   );
// };
