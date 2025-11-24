import { useThemeStore } from '@/stores/common/useThemeStore';

/**
 * Хук для управления темой приложения
 * Предоставляет доступ к текущей теме и методам её изменения
 */
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};
