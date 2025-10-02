import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Состояния сайдбаров
  isMainSidebarCollapsed: boolean;
  isSecondarySidebarCollapsed: boolean;

  // Методы для управления состояниями
  toggleMainSidebar: () => void;
  toggleSecondarySidebar: () => void;
  setMainSidebarCollapsed: (isCollapsed: boolean) => void;
  setSecondarySidebarCollapsed: (isCollapsed: boolean) => void;
}
/**
 * Store для управления UI состояниями с персистентностью в localStorage
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Начальные состояния
      isMainSidebarCollapsed: false,
      isSecondarySidebarCollapsed: false,

      // Методы для изменения состояния
      toggleMainSidebar: () =>
        set((state) => ({ isMainSidebarCollapsed: !state.isMainSidebarCollapsed })),

      toggleSecondarySidebar: () =>
        set((state) => ({ isSecondarySidebarCollapsed: !state.isSecondarySidebarCollapsed })),

      setMainSidebarCollapsed: (isCollapsed) =>
        set({ isMainSidebarCollapsed: isCollapsed }),

      setSecondarySidebarCollapsed: (isCollapsed) =>
        set({ isSecondarySidebarCollapsed: isCollapsed }),
    }),
    {
      name: 'ui-storage', // имя для хранения в localStorage
      partialize: (state) => ({
        // Сохраняем только эти свойства в localStorage
        isMainSidebarCollapsed: state.isMainSidebarCollapsed,
        isSecondarySidebarCollapsed: state.isSecondarySidebarCollapsed,
      }),
    }
  )
); 