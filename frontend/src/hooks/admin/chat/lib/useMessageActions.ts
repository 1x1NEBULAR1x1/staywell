"use client";

import type { Message } from "@shared/src/database";
import { useCallback } from "react";
import type { Socket } from "socket.io-client";
import { useAccount } from "@/hooks/common/useAccount";
import type { ChatWithLastMessage } from "./types";
import { useChatStore } from "./useChatStore";

/**
 * Sort messages by creation time, taking into account replace_to relationships
 * Messages that replace others should be sorted by the original message's creation time
 */
function sortMessagesByCreationTime(a: Message, b: Message): number {
  const getEffectiveCreationTime = (msg: Message): Date => {
    // If this message replaces another, use the replaced message's creation time
    // This ensures edited messages stay in their original position
    if (msg.replace_to) {
      // Find the original message's creation time
      // For now, we'll use the current message's creation time
      // In a full implementation, we'd need to track the original creation time
      return new Date(msg.created);
    }
    return new Date(msg.created);
  };

  const timeA = getEffectiveCreationTime(a).getTime();
  const timeB = getEffectiveCreationTime(b).getTime();

  return timeA - timeB;
}

interface UseMessageActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseMessageActionsReturn {
  sendMessage: (
    receiver_id: string,
    message: string,
    booking_id?: string,
  ) => void;
  editMessage: (message_id: string, new_message: string) => void;
  deleteMessage: (message_id: string) => void;
  markMessagesAsRead: (chat_partner_id: string) => void;
}

export const useMessageActions = (
  options: UseMessageActionsOptions,
): UseMessageActionsReturn => {
  const { socket, is_connected } = options;
  const store = useChatStore();
  const { user } = useAccount();

  // Create optimistic message for immediate UI update
  const createOptimisticMessage = useCallback(
    (
      receiver_id: string,
      message: string,
      booking_id?: string,
    ): Message | undefined => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (!user) return;
      return {
        id: tempId,
        sender_id: user.id,
        receiver_id,
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

  // Update chat list with optimistic message
  const updateChatWithOptimisticMessage = useCallback(
    (receiver_id: string, message: string) => {
      if (!user) return;
      const updated_chats = store.chats.map((chat: ChatWithLastMessage) => {
        if (chat.user.id === receiver_id) {
          return {
            ...chat,
            last_message: {
              id: `temp-${Date.now()}`,
              sender_id: user.id,
              receiver_id,
              message: `you: ${message}`,
              booking_id: null,
              is_read: false,
              edited: null,
              replace_to: null,
              is_excluded: false,
              created: new Date(),
              updated: new Date(),
              booking: null,
              replaces: [],
              replaced_by: null,
            },
          };
        }
        return chat;
      });

      store.setChats(updated_chats);
    },
    [store, user],
  );

  const sendMessage = useCallback(
    (receiver_id: string, message: string, booking_id?: string) => {
      if (!socket || !is_connected || !user) return;

      // Create optimistic message and add to messages list
      const optimisticMessage = createOptimisticMessage(
        receiver_id,
        message,
        booking_id,
      );
      store.setMessages(
        [...store.messages, optimisticMessage]
          .filter((e) => typeof e !== "undefined")
          .sort(
            (a, b) =>
              new Date(a.created).getTime() - new Date(b.created).getTime(),
          ),
      );

      // Update chat sidebar with "you: {message}"
      updateChatWithOptimisticMessage(receiver_id, message);

      // Send message to server
      socket.emit("send_message", { receiver_id, message, booking_id });
    },
    [
      socket,
      is_connected,
      user,
      store,
      createOptimisticMessage,
      updateChatWithOptimisticMessage,
    ],
  );

  const editMessage = useCallback(
    (message_id: string, new_message: string) => {
      if (!socket || !is_connected || !user) return;

      // Find the original message to preserve its creation time
      const originalMessage = store.messages.find((m) => m.id === message_id);
      if (!originalMessage) return;

      // Create optimistic edited message
      const tempId = `temp-edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const optimisticEditedMessage: Message = {
        id: tempId,
        sender_id: user.id,
        receiver_id: originalMessage.receiver_id,
        message: new_message,
        booking_id: originalMessage.booking_id,
        is_read: false,
        edited: new Date(),
        replace_to: message_id,
        is_excluded: false,
        created: originalMessage.created, // Preserve original creation time
        updated: new Date(),
      };

      // Replace the original message with the edited one optimistically
      store.setMessages(
        store.messages
          .map((m: Message) =>
            m.id === message_id ? optimisticEditedMessage : m,
          )
          .sort(sortMessagesByCreationTime),
      );

      socket.emit("edit_message", { message_id, message: new_message });
    },
    [socket, is_connected, user, store],
  );

  const deleteMessage = useCallback(
    (message_id: string) => {
      if (!socket || !is_connected) return;

      // Remove message optimistically
      store.setMessages(
        store.messages.filter((m: Message) => m.id !== message_id),
      );

      socket.emit("delete_message", { message_id });
    },
    [socket, is_connected, store],
  );

  const markMessagesAsRead = useCallback(
    (chat_partner_id: string) => {
      if (!socket || !is_connected) return;
      socket.emit("mark_messages_read", { chat_partner_id });
    },
    [socket, is_connected],
  );

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    markMessagesAsRead,
  };
};
