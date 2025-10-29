import type { Message } from "@shared/src";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatWithLastMessage } from "./types";

type Values = {
  selected_chat_id: string | null;
  search_query: string;
  chats: ChatWithLastMessage[];
  messages: Message[];
  online_users: string[];
  is_collapsed: boolean;
  is_connected: boolean;
};

type Actions = {
  selectChat: (chat_id: string | null) => void;
  setSearchQuery: (search_query: string) => void;
  setChats: (chats: ChatWithLastMessage[]) => void;
  setMessages: (messages: Message[]) => void;
  setOnlineUsers: (online_users: string[]) => void;
  clearChat: () => void;
  toggleCollapse: () => void;
  setIsConnected: (is_connected: boolean) => void;
};

type Store = Values & Actions;

export const useChatStore = create<Store>()(
  persist(
    (set, _get) => ({
      selected_chat_id: null,
      is_collapsed: false,
      is_connected: false,
      search_query: "",
      chats: [],
      messages: [],
      online_users: [],

      selectChat: (chat_id) =>
        set({
          selected_chat_id: chat_id,
        }),

      clearChat: () =>
        set({
          selected_chat_id: null,
        }),

      toggleCollapse: () =>
        set((state) => ({
          is_collapsed: !state.is_collapsed,
        })),

      setIsConnected: (is_connected) =>
        set({
          is_connected,
        }),

      setSearchQuery: (search_query) =>
        set({
          search_query,
        }),

      setChats: (chats) => {
        console.log("setChats called with", chats.length, "chats");
        set({
          chats,
        });
      },

      setMessages: (messages) =>
        set({
          messages,
        }),

      setOnlineUsers: (online_users) =>
        set({
          online_users,
        }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => state,
    },
  ),
);
