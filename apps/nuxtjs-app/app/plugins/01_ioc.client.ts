import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';

import { registerClientServices } from '~/services/register-client';

export default defineNuxtPlugin(() => {
  registerClientServices();

  ServiceLocator.default.get(IThemeService).initialize();
});
