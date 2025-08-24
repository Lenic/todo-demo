import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { registerClientService } from '#shared/services/register-client';

export default defineNuxtPlugin(async () => {
  registerClientService();

  ServiceLocator.default.get(IThemeService).initialize();
});
