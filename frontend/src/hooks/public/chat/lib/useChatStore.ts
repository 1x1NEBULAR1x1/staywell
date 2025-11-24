import type { Message } from "@shared/src";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Values = {
  messages: Message[];
  support_last_seen: Date | null;
  is_typing: boolean;
  is_connected: boolean;
};

type Actions = {
  setMessages: (messages: Message[]) => void;
  setSupportLastSeen: (last_seen: Date | null) => void;
  setIsTyping: (is_typing: boolean) => void;
  setIsConnected: (is_connected: boolean) => void;
};

type Store = Values & Actions;

export const useUserChatStore = create<Store>()(
  persist(
    (set, _get) => ({
      is_connected: false,
      messages: [],
      support_last_seen: null,
      is_typing: false,

      setIsConnected: (is_connected) =>
        set({
          is_connected,
        }),

      setMessages: (messages) =>
        set({
          messages,
        }),

      setSupportLastSeen: (last_seen) =>
        set({
          support_last_seen: last_seen,
        }),

      setIsTyping: (is_typing) =>
        set({
          is_typing,
        }),
    }),
    {
      name: "user-chat-storage",
      partialize: (state) => state,
    },
  ),
);

