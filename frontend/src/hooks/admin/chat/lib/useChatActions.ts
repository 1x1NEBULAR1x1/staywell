"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useChatStore, useHistoryActions } from ".";
import { useQPId } from "@/hooks/common/useId";

interface UseChatActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseChatActionsReturn {
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
  const router = useRouter();
  const current_chat_id = useQPId();
  chatStoreRef.current = chatStore;

  const joinChat = useCallback(
    (chat_partner_id: string) => {
      if (!socket || !is_connected) return;

      // Don't redirect if chat is already selected
      if (current_chat_id !== chat_partner_id) {
        router.push(`/admin/chat?id=${chat_partner_id}`);
      }

      socket.emit("join_chat", { chat_partner_id });
      getHistory(chat_partner_id);
    },
    [socket, is_connected, getHistory, router, current_chat_id],
  );

  const leaveChat = useCallback(
    (chat_partner_id: string) => {
      if (!socket || !is_connected) return;

      socket.emit("leave_chat", { chat_partner_id });
      // Navigate back to chat list without parameters
      router.push("/admin/chat");
      chatStoreRef.current.setMessages([]);
    },
    [socket, is_connected, router],
  );

  return {
    joinChat,
    leaveChat,
  };
};
