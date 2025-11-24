"use client";

import { useCallback } from "react";
import type { Socket } from "socket.io-client";
import { SUPPORT_CHAT_ID } from "./constants";

interface UseTypingActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseTypingActionsReturn {
  startTyping: () => void;
  stopTyping: () => void;
}

export const useTypingActions = (
  options: UseTypingActionsOptions,
): UseTypingActionsReturn => {
  const { socket, is_connected } = options;

  const startTyping = useCallback(() => {
    if (!socket || !is_connected) return;
    socket.emit("typing_start", { chat_partner_id: SUPPORT_CHAT_ID });
  }, [socket, is_connected]);

  const stopTyping = useCallback(() => {
    if (!socket || !is_connected) return;
    socket.emit("typing_stop", { chat_partner_id: SUPPORT_CHAT_ID });
  }, [socket, is_connected]);

  return {
    startTyping,
    stopTyping,
  };
};

