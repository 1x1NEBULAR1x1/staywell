"use client";

import type { Message } from "@shared/src/database";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useUserChatStore } from ".";
import { useAccount } from "@/hooks/common/useAccount";
import { SUPPORT_CHAT_ID } from "./constants";

interface UseWebSocketEventHandlersOptions {
  socket: Socket | null;
  getHistory?: (skip?: number, take?: number) => void;
  onNewMessage?: (message: Message) => void;
  onMessageEdited?: (message: Message) => void;
  onUserTyping?: (data: {
    user_id: string;
    chat_partner_id: string;
    is_typing: boolean;
  }) => void;
  onUserOnlineStatus?: (data: { user_id: string; last_seen: Date | null }) => void;
}

export const useWebSocketEventHandlers = (
  options: UseWebSocketEventHandlersOptions,
) => {
  const {
    socket,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
  } = options;

  const { user } = useAccount();
  const chatStore = useUserChatStore();
  const chatStoreRef = useRef(chatStore);
  chatStoreRef.current = chatStore;

  useEffect(() => {
    if (!socket) return;

    // Message events
    socket.on("new_message", (data: { message: Message }) => {
      const existingMessages = chatStoreRef.current.messages;
      const newMessage = data.message;

      // Check if this is a replacement for an optimistic message
      const optimisticIndex = existingMessages.findIndex(msg =>
        msg.id.startsWith('temp-') && // optimistic messages have temp IDs
        msg.sender_id === newMessage.sender_id &&
        msg.message === newMessage.message &&
        Math.abs(new Date(msg.created).getTime() - new Date(newMessage.created).getTime()) < 5000 // within 5 seconds
      );

      let updatedMessages;
      if (optimisticIndex !== -1) {
        // Replace optimistic message with real one
        updatedMessages = [...existingMessages];
        updatedMessages[optimisticIndex] = newMessage;
      } else {
        // Add new message
        updatedMessages = [...existingMessages, newMessage];
      }

      chatStoreRef.current.setMessages(
        updatedMessages.sort(
          (a, b) =>
            new Date(a.created).getTime() - new Date(b.created).getTime(),
        ),
      );

      // Reload history to ensure sync
      if (getHistory) {
        console.log("New message received, reloading history");
        getHistory();
      }

      onNewMessage?.(data.message);
    });

    socket.on("message_edited", (data: { message: Message }) => {
      chatStoreRef.current.setMessages(
        chatStoreRef.current.messages
          .map((m) => (m.id === data.message.id ? data.message : m))
          .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()),
      );
      onMessageEdited?.(data.message);
    });

    socket.on("message_deleted", (data: { message_id: string }) => {
      chatStoreRef.current.setMessages(
        chatStoreRef.current.messages.filter((m) => m.id !== data.message_id),
      );
    });

    // History loaded
    socket.on(
      "history_loaded",
      (data: { items: Message[]; total: number; skip: number; chat_partner_id: string }) => {
        if (data.chat_partner_id !== SUPPORT_CHAT_ID) return;

        if (data.skip === 0) {
          // First load or refresh - replace all messages
          chatStoreRef.current.setMessages(data.items);
        } else {
          // Pagination - append new messages
          const existingMessageIds = new Set(chatStoreRef.current.messages.map(m => m.id));
          const newMessages = data.items.filter(m => !existingMessageIds.has(m.id));
          chatStoreRef.current.setMessages([...chatStoreRef.current.messages, ...newMessages]);
        }
      },
    );

    // Typing events
    socket.on(
      "user_typing",
      (data: {
        user_id: string;
        chat_partner_id: string;
        is_typing: boolean;
      }) => {
        // Only handle typing from support
        if (data.user_id === SUPPORT_CHAT_ID) {
          chatStoreRef.current.setIsTyping(data.is_typing);
        }
        onUserTyping?.(data);
      },
    );

    // Online status events
    socket.on(
      "user_online_status",
      (data: { user_id: string; last_seen: Date | null }) => {
        // Only handle status from support
        if (data.user_id === SUPPORT_CHAT_ID) {
          chatStoreRef.current.setSupportLastSeen(data.last_seen);
        }
        onUserOnlineStatus?.(data);
      },
    );

    return () => {
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("history_loaded");
      socket.off("user_typing");
      socket.off("user_online_status");
    };
  }, [socket, getHistory, onNewMessage, onMessageEdited, onUserTyping, onUserOnlineStatus, user]);
};

