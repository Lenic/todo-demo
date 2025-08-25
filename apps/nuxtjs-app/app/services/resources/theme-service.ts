import type { EThemeColor, IThemeService } from '@todo/interface';
import type { Subscription } from 'rxjs';

import { Disposable } from '@todo/container';
import {
  DEFAULT_THEME,
  DEFAULT_THEME_COLOR,
  ETheme,
  preferColorScheme$,
  THEME_COLOR_LIST,
  THEME_STORAGE_KEY,
} from '@todo/interface';
import { filter, ReplaySubject, takeWhile, withLatestFrom } from 'rxjs';
import { toast } from 'vue-sonner';

import { message$, t$ } from '~/components/monitor';

import { THEME_COLOR_KEY } from '../../constants';
import { trpc } from '../../trpc/client';

class ThemeService extends Disposable implements IThemeService {
  private subscription: Subscription | null = null;
  private themeSubject = new ReplaySubject<ETheme>(1);

  private colorTrigger = new ReplaySubject<EThemeColor>(1);

  color = DEFAULT_THEME_COLOR;
  color$ = this.colorTrigger.asObservable();

  theme = DEFAULT_THEME;
  theme$ = this.themeSubject.asObservable();

  constructor() {
    super();

    this.disposeWithMe(
      this.theme$.pipe(filter((theme) => this.theme !== theme)).subscribe((theme) => {
        this.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }),
    );
    this.disposeWithMe(() => this.subscription?.unsubscribe());

    this.disposeWithMe(
      this.color$.pipe(filter((color) => this.color !== color)).subscribe((color) => {
        this.color = color;
      }),
    );

    this.disposeWithMe(
      this.color$
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

    this.disposeWithMe(
      message$
        .pipe(
          filter((v) => v.type === 'set-system-dictionary-item'),
          filter((v) => v.item.key === THEME_COLOR_KEY),
        )
        .subscribe(({ item }) => {
          this.setColorCore(item.value as EThemeColor);
        }),
    );

    this.initialize();
  }

  initialize(): void {
    if (typeof window === 'undefined') return;

    this.setThemeCore((localStorage.getItem(THEME_STORAGE_KEY) as ETheme | null) ?? DEFAULT_THEME);

    const list = Array.from(document.documentElement.classList);
    const color = list.find((item) => item.startsWith('theme-'));
    if (color) {
      this.color = color.slice(6) as EThemeColor;
    }
  }

  setTheme = (theme: ETheme) => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    if (root.classList.contains(theme)) return;

    this.setThemeCore(theme);
  };

  private setThemeCore = (theme: ETheme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === ETheme.SYSTEM) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = preferColorScheme$.subscribe((currentTheme) => {
        if (root.classList.contains(currentTheme)) return;

        root.classList.remove('light', 'dark');
        root.classList.add(currentTheme);
        this.themeSubject.next(theme);
      });
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      root.classList.add(theme);
      this.themeSubject.next(theme);
    }
  };

  setColor = (theme: EThemeColor) => {
    if (typeof window !== 'undefined') {
      this.setColorCore(theme);
    }
    this.colorTrigger.next(theme);
  };

  private setColorCore = (theme: EThemeColor) => {
    const className = `theme-${theme}`;
    const root = window.document.documentElement;
    if (root.classList.contains(className)) return;

    THEME_COLOR_LIST.forEach((color) => {
      root.classList.remove(`theme-${color}`);
    });

    root.classList.add(className);
  };
}

export { ThemeService };
