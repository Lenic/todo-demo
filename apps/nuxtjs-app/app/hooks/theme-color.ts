import type { EThemeColor } from '@todo/interface';

export const useThemeColor = () => useState<EThemeColor | null>('themeColor', () => null);
