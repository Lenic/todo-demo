import { Disposable, injectableWith } from '@todo/container';
import { filter, ReplaySubject, Subscription } from 'rxjs';

import { DEFAULT_THEME, preferColorScheme$, THEME_STORAGE_KEY } from './constants';
import { ETheme, IThemeService } from './types';

const getCurrentTheme = () => (localStorage.getItem(THEME_STORAGE_KEY) as ETheme | null) ?? DEFAULT_THEME;

@injectableWith(IThemeService)
class ThemeService extends Disposable implements IThemeService {
  private subscription: Subscription | null = null;
  private themeSubject = new ReplaySubject<ETheme>(1);

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
  }

  initialize() {
    this.setTheme(getCurrentTheme());
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
}

export { ThemeService };
