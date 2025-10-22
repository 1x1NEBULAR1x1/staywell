import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Draft = {
  chat_id: string;
  message: string;
}

type Values = {
  selected_chat_id?: string;
  drafts: Draft[];
  message_value: string;
  is_collapsed: boolean;
}

type Actions = {
  selectChat: (chat_id: string) => void;
  setMessageValue: (value: string) => void;
  clearDraft: (chat_id: string) => void;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

type Store = Values & Actions;

export const useChatStore = create<Store>()(
  persist(
    (set, get) => ({
      selected_chat_id: undefined,
      drafts: [],
      message_value: '',
      is_collapsed: false,

      selectChat: (chat_id) => {
        const draft = get().drafts.find((d) => d.chat_id === chat_id);
        set({
          selected_chat_id: chat_id,
          message_value: draft?.message || '',
          is_collapsed: false, // Разворачиваем чат при выборе собеседника
        });
      },

      setMessageValue: (value) => set((state) => {
        if (!state.selected_chat_id) return state;

        const filtered_drafts = state.drafts.filter(d => d.chat_id !== state.selected_chat_id);
        const new_drafts = value.trim()
          ? [...filtered_drafts, { chat_id: state.selected_chat_id, message: value }]
          : filtered_drafts;

        return {
          ...state,
          message_value: value,
          drafts: new_drafts
        };
      }),

      clearDraft: (chat_id) => set((state) => ({
        ...state,
        drafts: state.drafts.filter(d => d.chat_id !== chat_id),
        message_value: state.selected_chat_id === chat_id ? '' : state.message_value,
      })),

      toggleCollapse: () => set((state) => ({
        ...state,
        is_collapsed: !state.is_collapsed,
      })),

      setCollapsed: (collapsed) => set((state) => ({
        ...state,
        is_collapsed: collapsed,
      })),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        selected_chat_id: state.selected_chat_id,
        drafts: state.drafts,
        is_collapsed: state.is_collapsed,
      }),
    }
  )
);