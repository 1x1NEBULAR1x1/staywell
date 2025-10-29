"use client";

import type { Message } from "@shared/src/database";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import type { ChatWithLastMessage } from ".";
import { useChatStore } from ".";
import { useAccount } from "@/hooks/common/useAccount";

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
  onUserOnlineStatus?: (data: { user_id: string; is_online: boolean }) => void;
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
  const chatStore = useChatStore();
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

      // If this message is for the currently selected chat, reload history to ensure sync
      const senderId = data.message.sender_id;
      const receiverId = data.message.receiver_id;
      const chatPartnerId = senderId === user?.id ? receiverId : senderId;

      if (selected_chat_id === chatPartnerId && getHistory) {
        console.log("New message received for selected chat, reloading history");
        getHistory(chatPartnerId);
      }

      // Avoid duplicates
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

    // Chats loaded
    socket.on(
      "chats_loaded",
      (data: { items: ChatWithLastMessage[]; total: number }) => {
        console.log("chats_loaded received", { count: data.items.length, total: data.total });
        chatStoreRef.current.setChats(data.items);
      },
    );

    // Chats updated (when new messages arrive)
    socket.on("chats_updated", () => {
      console.log("chats_updated received, refreshing chats list");
      // Refresh the chats list when it gets updated
      if (chatStoreRef.current.chats.length > 0) {
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
      (data: { user_id: string; is_online: boolean }) => {
        chatStoreRef.current.setOnlineUsers(
          chatStoreRef.current.online_users.map((id) =>
            id !== data.user_id ? id : data.user_id,
          ),
        );
        if (data.is_online) {
          chatStoreRef.current.setOnlineUsers([
            ...new Set([...chatStoreRef.current.online_users, data.user_id]),
          ]);
        } else {
          chatStoreRef.current.setOnlineUsers(
            chatStoreRef.current.online_users.filter(
              (id) => id !== data.user_id,
            ),
          );
        }
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
  }, [socket, selected_chat_id, getHistory, onNewMessage, onMessageEdited, onUserTyping, onUserOnlineStatus]);
};
