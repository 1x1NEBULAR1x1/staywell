import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JsonEditorState {
  expandedNodes: Set<string>;
  editingPath: string | null;
  selectedPath: string | null;
}

interface JsonEditorStore extends JsonEditorState {
  toggleNode: (path: string) => void;
  setEditingPath: (path: string | null) => void;
  setSelectedPath: (path: string | null) => void;
  clearState: () => void;
}

/**
 * Store для управления состоянием JsonEditor с персистентностью в localStorage
 */
export const useJsonEditorStore = create<JsonEditorStore>()(
  persist(
    (set) => ({
      expandedNodes: new Set<string>(),
      editingPath: null,
      selectedPath: null,

      toggleNode: (path) =>
        set((state) => {
          const newExpandedNodes = new Set(state.expandedNodes);
          if (newExpandedNodes.has(path)) {
            newExpandedNodes.delete(path);
          } else {
            newExpandedNodes.add(path);
          }
          return { expandedNodes: newExpandedNodes };
        }),

      setEditingPath: (path) =>
        set({
          editingPath: path,
        }),

      setSelectedPath: (path) =>
        set({
          selectedPath: path,
        }),

      clearState: () =>
        set({
          expandedNodes: new Set<string>(),
          editingPath: null,
          selectedPath: null,
        }),
    }),
    {
      name: 'json-editor-storage',
      partialize: (state) => ({
        expandedNodes: Array.from(state.expandedNodes),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Преобразуем массив обратно в Set при восстановлении
          state.expandedNodes = new Set(state.expandedNodes as unknown as string[]);
        }
      },
    }
  )
); 