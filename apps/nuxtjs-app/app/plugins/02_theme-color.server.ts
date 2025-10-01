import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { appRouter } from '~/trpc';

const caller = appRouter.createCaller({});
export default defineNuxtPlugin(async () => {
  const { status } = useAuth();
  if (status.value === 'unauthenticated') return;

  const event = useRequestEvent();
  if (!event) return;

  const themeColor = useThemeColor();
  const color = await caller.theme.getThemeColor();
  ServiceLocator.default.get(IThemeService).setColor(color);

  themeColor.value = color;
  event.context.themeColor = color;
});
