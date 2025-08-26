import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { getThemeColor } from '~/actions';

export default defineNuxtPlugin(async () => {
  const headers = useRequestHeaders();
  const themeColor = await getThemeColor(headers);
  ServiceLocator.default.get(IThemeService).setColor(themeColor);

  return {
    provide: { themeColor },
  };
});
