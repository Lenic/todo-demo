import { Disposable, injectableWith } from '@todo/container';
import { filter, ReplaySubject, Subscription } from 'rxjs';

import {
  DEFAULT_THEME,
  DEFAULT_THEME_COLOR,
  preferColorScheme$,
  THEME_COLOR_LIST,
  THEME_COLOR_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from './constants';
import { ETheme, EThemeColor, IThemeService } from './types';

const getCurrentTheme = () => (localStorage.getItem(THEME_STORAGE_KEY) as ETheme | null) ?? DEFAULT_THEME;

const getCurrentThemeColor = () =>
  (localStorage.getItem(THEME_COLOR_STORAGE_KEY) as EThemeColor | null) ?? DEFAULT_THEME_COLOR;

@injectableWith(IThemeService)
class ThemeService extends Disposable implements IThemeService {
  private subscription: Subscription | null = null;
  private themeSubject = new ReplaySubject<ETheme>(1);

  private colorTrigger = new ReplaySubject<EThemeColor>(1);

  color = getCurrentThemeColor();
  color$ = this.colorTrigger.asObservable();

  theme = getCurrentTheme();
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
      this.color$.pipe(filter((theme) => this.color !== theme)).subscribe((theme) => {
        this.color = theme;
        localStorage.setItem(THEME_COLOR_STORAGE_KEY, theme);
      }),
    );
  }

  initialize() {
    this.setTheme(getCurrentTheme());
    this.setColor(getCurrentThemeColor());
  }

  setTheme(theme: ETheme) {
    const root = window.document.documentElement;
    if (root.classList.contains(theme)) return;

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
  }

  setColor(theme: EThemeColor) {
    const className = `theme-${theme}`;
    const root = window.document.documentElement;
    if (root.classList.contains(className)) return;

    THEME_COLOR_LIST.forEach((color) => {
      root.classList.remove(`theme-${color}`);
    });

    root.classList.add(className);
    this.colorTrigger.next(theme);
  }
}

export { ThemeService };
