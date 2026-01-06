"use client";

import type { Message } from "@shared/src/database";
import { useCallback } from "react";
import type { Socket } from "socket.io-client";
import { useAccount } from "@/hooks/common/useAccount";
import { SUPPORT_CHAT_ID } from "./constants";
import { useUserChatStore } from "./useChatStore";

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
  const store = useUserChatStore();
  const { user } = useAccount();

  // Create optimistic message for immediate UI update
  const createOptimisticMessage = useCallback(
    (message: string, booking_id?: string): Message | undefined => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (!user) return;
      return {
        id: tempId,
        sender_id: user.id,
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
      if (!socket || !is_connected || !user) {
        console.warn(
          "Cannot send message: socket not connected or user not available",
          {
            socket: !!socket,
            is_connected,
            user: !!user,
          },
        );
        return;
      }

      console.log("Sending message to support:", message);

      // Create optimistic message and add to messages list
      const optimistic_message = createOptimisticMessage(message, booking_id);
      if (optimistic_message) {
        store.setMessages(
          [...store.messages, optimistic_message]
            .filter((e) => typeof e !== "undefined")
            .sort(
              (a, b) =>
                new Date(a.created).getTime() - new Date(b.created).getTime(),
            ),
        );
      }

      // Send message to server
      socket.emit("send_message", {
        receiver_id: SUPPORT_CHAT_ID,
        message,
        booking_id,
      });

      console.log("Message sent via WebSocket:", {
        receiver_id: SUPPORT_CHAT_ID,
        message,
        booking_id,
      });
    },
    [socket, is_connected, user, store, createOptimisticMessage],
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
