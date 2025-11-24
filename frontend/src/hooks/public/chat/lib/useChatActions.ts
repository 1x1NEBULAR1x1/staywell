"use client";

import { useCallback } from "react";
import type { Socket } from "socket.io-client";
import { SUPPORT_CHAT_ID } from "./constants";

interface UseChatActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
  getHistory: (skip?: number, take?: number) => void;
}

interface UseChatActionsReturn {
  joinSupportChat: () => void;
  leaveSupportChat: () => void;
}

export const useChatActions = (
  options: UseChatActionsOptions,
): UseChatActionsReturn => {
  const { socket, is_connected, getHistory } = options;

  const joinSupportChat = useCallback(() => {
    if (!socket || !is_connected) return;

    console.log("Joining support chat");
    socket.emit("join_chat", { chat_partner_id: SUPPORT_CHAT_ID });
    getHistory();
  }, [socket, is_connected, getHistory]);

  const leaveSupportChat = useCallback(() => {
    if (!socket || !is_connected) return;

    console.log("Leaving support chat");
    socket.emit("leave_chat", { chat_partner_id: SUPPORT_CHAT_ID });
  }, [socket, is_connected]);

  return {
    joinSupportChat,
    leaveSupportChat,
  };
};

