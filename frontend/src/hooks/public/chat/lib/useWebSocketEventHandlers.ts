"use client";

import type { Message } from "@shared/src/database";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useUserChatStore } from ".";
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
  onUserOnlineStatus?: (data: {
    user_id: string;
    last_seen: Date | null;
  }) => void;
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

  const store = useUserChatStore();
  const store_ref = useRef(store);
  store_ref.current = store;

  useEffect(() => {
    if (!socket) return;

    // Message events
    socket.on("new_message", (data: { message: Message }) => {
      const existing_messages = store_ref.current.messages;
      const new_message = data.message;

      // Check if this is a replacement for an optimistic message
      const optimistic_index = existing_messages.findIndex(
        (msg: Message) =>
          msg.id.startsWith("temp-") && // optimistic messages have temp IDs
          msg.sender_id === new_message.sender_id &&
          msg.message === new_message.message &&
          Math.abs(
            new Date(msg.created).getTime() -
              new Date(new_message.created).getTime(),
          ) < 5000, // within 5 seconds
      );

      let updated_messages: Message[];
      if (optimistic_index !== -1) {
        // Replace optimistic message with real one
        updated_messages = [...existing_messages];
        updated_messages[optimistic_index] = new_message;
      } else {
        // Add new message
        updated_messages = [...existing_messages, new_message];
      }

      store_ref.current.setMessages(
        updated_messages.sort(
          (a: Message, b: Message) =>
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
      store_ref.current.setMessages(
        store_ref.current.messages
          .map((m: Message) => (m.id === data.message.id ? data.message : m))
          .sort(
            (a: Message, b: Message) =>
              new Date(a.created).getTime() - new Date(b.created).getTime(),
          ),
      );
      onMessageEdited?.(data.message);
    });

    socket.on("message_deleted", (data: { message_id: string }) => {
      store_ref.current.setMessages(
        store_ref.current.messages.filter(
          (m: Message) => m.id !== data.message_id,
        ),
      );
    });

    // History loaded
    socket.on(
      "history_loaded",
      (data: {
        items: Message[];
        total: number;
        skip: number;
        chat_partner_id: string;
      }) => {
        if (data.chat_partner_id !== SUPPORT_CHAT_ID) return;

        if (data.skip === 0) {
          // First load or refresh - replace all messages
          store_ref.current.setMessages(data.items);
        } else {
          // Pagination - append new messages
          const existing_message_ids = new Set(
            store_ref.current.messages.map((m: Message) => m.id),
          );
          const new_messages = data.items.filter(
            (m: Message) => !existing_message_ids.has(m.id),
          );
          store_ref.current.setMessages([
            ...store_ref.current.messages,
            ...new_messages,
          ]);
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
          store_ref.current.setIsTyping(data.is_typing);
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
          store_ref.current.setSupportLastSeen(data.last_seen);
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
  }, [
    socket,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
  ]);
};
