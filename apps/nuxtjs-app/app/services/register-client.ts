import type { EThemeColor } from '@todo/interface';

import { ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';
import { filter, withLatestFrom } from 'rxjs';
import { toast } from 'vue-sonner';

import { THEME_COLOR_KEY } from '~/constants';
import { message$, t$ } from '~/sections/monitor';
import { trpc } from '~/trpc/client';

import { DataService, IDBDataService, ThemeService } from './resources';

export const registerClientServices = () => {
  ServiceLocator.default.container.set(IThemeService, { creator: ThemeService, dependencies: [] });
  ServiceLocator.default.container.set(IDBDataService, { creator: DataService, dependencies: [] });

  const themeService = ServiceLocator.default.get(IThemeService);
  themeService.initialize();

  ServiceLocator.default.container.disposeWithMe(
    themeService.color$.pipe(withLatestFrom(t$)).subscribe(([color, t]) => {
      trpc.theme.setThemeColor.mutate({ color }).catch(() => {
        toast(t('settings.theme-color.switch-error'));
      });
    }),
  );

  ServiceLocator.default.container.disposeWithMe(
    message$
      .pipe(
        filter((v) => v.type === 'set-system-dictionary-item'),
        filter((v) => v.item.key === THEME_COLOR_KEY),
      )
      .subscribe(({ item }) => {
        themeService.setColor(item.value as EThemeColor);
      }),
  );
};
