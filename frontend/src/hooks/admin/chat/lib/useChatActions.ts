"use client";

import { useCallback, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useChatStore, useHistoryActions } from ".";

interface UseChatActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseChatActionsReturn {
  selectChat: (chat_id: string | null) => void;
  joinChat: (chat_partner_id: string) => void;
  leaveChat: (chat_partner_id: string) => void;
}

export const useChatActions = (
  options: UseChatActionsOptions,
): UseChatActionsReturn => {
  const { socket, is_connected } = options;
  const chatStore = useChatStore();
  const { getHistory } = useHistoryActions(options);
  const chatStoreRef = useRef(chatStore);
  chatStoreRef.current = chatStore;

  const selectChat = useCallback((chat_id: string | null) => {
    chatStoreRef.current.selectChat(chat_id);
  }, []);

  const joinChat = useCallback(
    (chat_partner_id: string) => {
      if (!socket || !is_connected) return;
      socket.emit("join_chat", { chat_partner_id });
      // Only select chat if it's not already selected to prevent infinite loops
      if (chatStoreRef.current.selected_chat_id !== chat_partner_id) {
        chatStoreRef.current.selectChat(chat_partner_id);
      }
      getHistory(chat_partner_id);
    },
    [socket, is_connected, getHistory],
  );

  const leaveChat = useCallback(
    (chat_partner_id: string) => {
      if (!socket || !is_connected) return;

      socket.emit("leave_chat", { chat_partner_id });
      if (chatStoreRef.current.selected_chat_id === chat_partner_id) {
        chatStoreRef.current.selectChat(null);
        chatStoreRef.current.setMessages([]);
      }
    },
    [socket, is_connected],
  );

  return {
    selectChat,
    joinChat,
    leaveChat,
  };
};
