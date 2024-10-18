import { ReplaySubject, Subscription } from 'rxjs';

import { Disposable, injectableWith } from '@/lib/injector';

import { DEFAULT_THEME, preferColorScheme$, THEME_STORAGE_KEY } from './constants';
import { ETheme, IThemeService } from './types';

@injectableWith(IThemeService)
class ThemeService extends Disposable implements IThemeService {
  private subscription: Subscription | null = null;
  private themeSubject = new ReplaySubject<ETheme>(1);

  theme = ETheme.SYSTEM;
  theme$ = this.themeSubject.asObservable();

  constructor() {
    super();

    this.disposeWithMe(this.theme$.subscribe((theme) => void (this.theme = theme)));
    this.disposeWithMe(() => {
      this.themeSubject.complete();
    });
    this.disposeWithMe(() => this.subscription?.unsubscribe());
  }

  initialize() {
    this.setTheme((localStorage.getItem(THEME_STORAGE_KEY) as ETheme | null) ?? DEFAULT_THEME);
  }

  setTheme(theme: ETheme) {
    const root = window.document.documentElement;
    if (root.classList.contains(theme)) return;

    root.classList.remove('light', 'dark');

    if (theme === ETheme.SYSTEM) {
      if (this.subscription) return;

      this.subscription = preferColorScheme$.subscribe((currentTheme) => {
        if (root.classList.contains(currentTheme)) return;

        root.classList.remove('light', 'dark');
        root.classList.add(currentTheme);
        this.themeSubject.next(currentTheme);
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
