"use client";

import { useCallback } from "react";
import type { Socket } from "socket.io-client";
import { useUserChatStore } from "./useChatStore";
import { useAccount } from "@/hooks/common/useAccount";
import type { Message } from "@shared/src/database";
import { SUPPORT_CHAT_ID } from "./constants";

interface UseMessageActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseMessageActionsReturn {
  sendMessage: (message: string, booking_id?: string) => void;
  editMessage: (message_id: string, new_message: string) => void;
  deleteMessage: (message_id: string) => void;
  markMessagesAsRead: () => void;
}

export const useMessageActions = (
  options: UseMessageActionsOptions,
): UseMessageActionsReturn => {
  const { socket, is_connected } = options;
  const chatStore = useUserChatStore();
  const { user } = useAccount();

  // Create optimistic message for immediate UI update
  const createOptimisticMessage = useCallback(
    (message: string, booking_id?: string): Message => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        id: tempId,
        sender_id: user!.id,
        receiver_id: SUPPORT_CHAT_ID,
        message,
        booking_id: booking_id || null,
        is_read: false,
        edited: null,
        replace_to: null,
        is_excluded: false,
        created: new Date(),
        updated: new Date(),
      };
    },
    [user],
  );

  const sendMessage = useCallback(
    (message: string, booking_id?: string) => {
      if (!socket || !is_connected || !user) return;

      // Create optimistic message and add to messages list
      const optimisticMessage = createOptimisticMessage(message, booking_id);
      chatStore.setMessages([
        ...chatStore.messages,
        optimisticMessage,
      ].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()));

      // Send message to server
      socket.emit("send_message", { receiver_id: SUPPORT_CHAT_ID, message, booking_id });
    },
    [socket, is_connected, user, chatStore, createOptimisticMessage],
  );

  const editMessage = useCallback(
    (message_id: string, new_message: string) => {
      if (!socket || !is_connected) return;
      socket.emit("edit_message", { message_id, message: new_message });
    },
    [socket, is_connected],
  );

  const deleteMessage = useCallback(
    (message_id: string) => {
      if (!socket || !is_connected) return;
      socket.emit("delete_message", { message_id });
    },
    [socket, is_connected],
  );

  const markMessagesAsRead = useCallback(() => {
    if (!socket || !is_connected) return;
    socket.emit("mark_messages_read", { chat_partner_id: SUPPORT_CHAT_ID });
  }, [socket, is_connected]);

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    markMessagesAsRead,
  };
};

