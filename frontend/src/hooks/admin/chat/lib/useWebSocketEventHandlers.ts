"use client";

import type { Message } from "@shared/src/database";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useAccount } from "@/hooks/common/useAccount";
import type { ChatWithLastMessage } from ".";
import { useChatStore } from ".";

interface UseWebSocketEventHandlersOptions {
  socket: Socket | null;
  selected_chat_id: string | null;
  getHistory?: (chat_partner_id: string, skip?: number, take?: number) => void;
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
    selected_chat_id,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
  } = options;

  const { user } = useAccount();
  const store = useChatStore();
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
        (msg) =>
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

      // If this message is for the currently selected chat, reload history to ensure sync
      const sender_id = data.message.sender_id;
      const receiver_id = data.message.receiver_id;
      const chat_partner_id = sender_id === user?.id ? receiver_id : sender_id;

      if (selected_chat_id === chat_partner_id && getHistory) {
        console.log(
          "New message received for selected chat, reloading history",
        );
        getHistory(chat_partner_id);
      }

      // Avoid duplicates
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

    // Chats loaded
    socket.on(
      "chats_loaded",
      (data: { items: ChatWithLastMessage[]; total: number }) => {
        // Initialize online_users with data from loaded chats
        const new_online_users = { ...store_ref.current.online_users };
        data.items.forEach((chat) => {
          if (chat.last_seen) {
            // Set last seen time from server data
            new_online_users[chat.user.id] = new Date(chat.last_seen).getTime();
          }
        });

        store_ref.current.setOnlineUsers(new_online_users);

        store_ref.current.setChats(data.items);
      },
    );

    // Chats updated (when new messages arrive or read status changes)
    socket.on("chats_updated", () => {
      // Refresh the chats list when it gets updated
      if (store_ref.current.chats.length > 0) {
        socket.emit("get_chats", { skip: 0, take: 50 });
      }
    });

    // Typing events
    socket.on(
      "user_typing",
      (data: {
        user_id: string;
        chat_partner_id: string;
        is_typing: boolean;
      }) => {
        onUserTyping?.(data);
      },
    );

    // Online status events
    socket.on(
      "user_online_status",
      (data: { user_id: string; last_seen: Date | null }) => {
        store_ref.current.updateUserLastSeen(data.user_id, data.last_seen);
        onUserOnlineStatus?.(data);
      },
    );

    return () => {
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("history_loaded");
      socket.off("chats_loaded");
      socket.off("chats_updated");
      socket.off("user_typing");
      socket.off("user_online_status");
    };
  }, [
    socket,
    selected_chat_id,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
    user?.id,
  ]);
};
