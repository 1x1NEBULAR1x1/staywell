import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Store для управления темой приложения с персистентностью в localStorage
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      setTheme: (theme: Theme) => {
        set({ theme });
        // Применяем тему к document
        applyTheme(theme);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // При восстановлении темы из localStorage применяем её
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

/**
 * Применяет тему к document element
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Устанавливаем data-theme атрибут
  root.setAttribute('data-theme', theme);

  // Для совместимости с prefers-color-scheme
  if (theme === 'dark') {
    root.style.colorScheme = 'dark';
  } else {
    root.style.colorScheme = 'light';
  }
}

// Инициализируем тему при загрузке модуля
if (typeof window !== 'undefined') {
  const { theme } = useThemeStore.getState();
  applyTheme(theme);
}
