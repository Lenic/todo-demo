import { Disposable, injectableWith } from '@todo/container';
import {
  DEFAULT_THEME,
  DEFAULT_THEME_COLOR,
  ETheme,
  EThemeColor,
  IThemeService,
  preferColorScheme$,
  THEME_COLOR_LIST,
  THEME_COLOR_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from '@todo/interface';
import { filter, ReplaySubject, Subscription } from 'rxjs';

@injectableWith(IThemeService)
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
      this.color$.pipe(filter((theme) => this.color !== theme)).subscribe((theme) => {
        this.color = theme;
        localStorage.setItem(THEME_COLOR_STORAGE_KEY, theme);
      }),
    );

    this.initialize();
  }

  initialize(): void {
    if (typeof window === 'undefined') return;

    const list = Array.from(document.documentElement.classList);

    const themeSet = new Set(Object.values(ETheme) as string[]);
    const theme = list.find((item) => themeSet.has(item));
    this.setTheme(theme as ETheme);

    const color = list.find((item) => item.startsWith('theme-'));
    if (color) {
      this.setColor(color.slice(6) as EThemeColor);
    }
  }

  setTheme = (theme: ETheme) => {
    if (typeof window === 'undefined') return;

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
  };

  setColor = (theme: EThemeColor) => {
    if (typeof window === 'undefined') return;

    const className = `theme-${theme}`;
    const root = window.document.documentElement;
    if (root.classList.contains(className)) return;

    THEME_COLOR_LIST.forEach((color) => {
      root.classList.remove(`theme-${color}`);
    });

    root.classList.add(className);
    this.colorTrigger.next(theme);
  };
}

export { ThemeService };
