import type { Message } from "@shared/src";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatWithLastMessage } from "./types";

type Values = {
  search_query: string;
  chats: ChatWithLastMessage[];
  messages: Message[];
  online_users: Record<string, number>; // user_id -> last_seen_timestamp
  is_collapsed: boolean;
  is_connected: boolean;
};

type Actions = {
  setSearchQuery: (search_query: string) => void;
  setChats: (chats: ChatWithLastMessage[]) => void;
  setMessages: (messages: Message[]) => void;
  setOnlineUsers: (online_users: Record<string, number>) => void;
  updateUserLastSeen: (user_id: string, last_seen: Date | null) => void;
  toggleCollapse: () => void;
  setIsConnected: (is_connected: boolean) => void;
};

type Store = Values & Actions;

export const useChatStore = create<Store>()(
  persist(
    (set, _get) => ({
      is_collapsed: false,
      is_connected: false,
      search_query: "",
      chats: [],
      messages: [],
      online_users: {},

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

      updateUserLastSeen: (user_id, last_seen) =>
        set((state) => {
          const now = Date.now();
          const newOnlineUsers = { ...state.online_users };

          if (last_seen) {
            newOnlineUsers[user_id] = new Date(last_seen).getTime();
          } else {
            // If last_seen is null, remove from online_users
            delete newOnlineUsers[user_id];
          }

          // Update chats last_seen status
          const updatedChats = state.chats.map(chat => {
            if (chat.user.id === user_id) {
              return { ...chat, last_seen };
            }
            return chat;
          });

          return {
            online_users: newOnlineUsers,
            chats: updatedChats,
          };
        }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => state,
    },
  ),
);
