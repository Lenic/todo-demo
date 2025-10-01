import type { EThemeColor } from '@todo/interface';

import { register, ServiceLocator } from '@todo/container';
import { IThemeService } from '@todo/interface';
import { filter, takeWhile, withLatestFrom } from 'rxjs';
import { toast } from 'vue-sonner';

import { THEME_COLOR_KEY } from '~/constants';
import { message$, t$ } from '~/sections/monitor';
import { trpc } from '~/trpc/client';

import { ThemeService } from './resources/theme-service';

export const registerClientServices = () => {
  register(IThemeService, ThemeService);

  const themeService = ServiceLocator.default.get(IThemeService);
  themeService.initialize();
  ServiceLocator.default.disposeWithMe(
    themeService.color$
      .pipe(
        takeWhile(() => typeof window !== 'undefined'),
        withLatestFrom(t$),
      )
      .subscribe(([color, t]) => {
        trpc.theme.setThemeColor.mutate({ color }).catch(() => {
          toast(t('settings.theme-color.switch-error'));
        });
      }),
  );
  ServiceLocator.default.disposeWithMe(
    message$
      .pipe(
        // filter((v) => v.type === 'set-system-dictionary-item'),
        filter((v) => v.item.key === THEME_COLOR_KEY),
      )
      .subscribe(({ item }) => {
        themeService.setColor(item.value as EThemeColor);
      }),
  );
};
