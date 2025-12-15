import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Sidebar states
  isMainSidebarCollapsed: boolean;
  isSecondarySidebarCollapsed: boolean;

  // Methods for state management
  toggleMainSidebar: () => void;
  toggleSecondarySidebar: () => void;
  setMainSidebarCollapsed: (isCollapsed: boolean) => void;
  setSecondarySidebarCollapsed: (isCollapsed: boolean) => void;
}
/**
 * Store for managing UI states with localStorage persistence
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial states
      isMainSidebarCollapsed: false,
      isSecondarySidebarCollapsed: false,

      // Methods for state modification
      toggleMainSidebar: () =>
        set((state) => ({
          isMainSidebarCollapsed: !state.isMainSidebarCollapsed,
        })),

      toggleSecondarySidebar: () =>
        set((state) => ({
          isSecondarySidebarCollapsed: !state.isSecondarySidebarCollapsed,
        })),

      setMainSidebarCollapsed: (isCollapsed) =>
        set({ isMainSidebarCollapsed: isCollapsed }),

      setSecondarySidebarCollapsed: (isCollapsed) =>
        set({ isSecondarySidebarCollapsed: isCollapsed }),
    }),
    {
      name: "ui-storage", // name for localStorage storage
      partialize: (state) => ({
        // Save only these properties in localStorage
        isMainSidebarCollapsed: state.isMainSidebarCollapsed,
        isSecondarySidebarCollapsed: state.isSecondarySidebarCollapsed,
      }),
    },
  ),
);
