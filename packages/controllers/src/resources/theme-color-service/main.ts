import { Disposable, injectableWith } from '@todo/container';
import { filter, ReplaySubject } from 'rxjs';

import { DEFAULT_THEME_COLOR, THEME_COLOR_LIST, THEME_COLOR_STORAGE_KEY } from './constants';
import { EThemeColor, IThemeColorService } from './types';

const getCurrentThemeColor = () =>
  (localStorage.getItem(THEME_COLOR_STORAGE_KEY) as EThemeColor | null) ?? DEFAULT_THEME_COLOR;

@injectableWith(IThemeColorService)
class ThemeColorService extends Disposable implements IThemeColorService {
  private themeColorTrigger = new ReplaySubject<EThemeColor>(1);

  themeColor = getCurrentThemeColor();
  themeColor$ = this.themeColorTrigger.asObservable();

  constructor() {
    super();

    this.disposeWithMe(
      this.themeColor$.pipe(filter((theme) => this.themeColor !== theme)).subscribe((theme) => {
        this.themeColor = theme;
        localStorage.setItem(THEME_COLOR_STORAGE_KEY, theme);
      }),
    );
  }

  initialize() {
    this.setThemeColor(getCurrentThemeColor());
  }

  setThemeColor(theme: EThemeColor) {
    const className = `theme-${theme}`;
    const root = window.document.documentElement;
    if (root.classList.contains(className)) return;

    THEME_COLOR_LIST.forEach((color) => {
      root.classList.remove(`theme-${color}`);
    });

    root.classList.add(className);
    this.themeColorTrigger.next(theme);
  }
}

export { ThemeColorService };
