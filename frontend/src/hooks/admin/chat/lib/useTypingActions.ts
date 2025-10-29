"use client";

import { useCallback } from "react";
import type { Socket } from "socket.io-client";

interface UseTypingActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseTypingActionsReturn {
  startTyping: (chat_partner_id: string) => void;
  stopTyping: (chat_partner_id: string) => void;
}

export const useTypingActions = (
  options: UseTypingActionsOptions,
): UseTypingActionsReturn => {
  const { socket, is_connected } = options;

  const startTyping = useCallback(
    (chat_partner_id: string) => {
      if (!socket || !is_connected) return;
      socket.emit("typing_start", { chat_partner_id });
    },
    [socket, is_connected],
  );

  const stopTyping = useCallback(
    (chat_partner_id: string) => {
      if (!socket || !is_connected) return;
      socket.emit("typing_stop", { chat_partner_id });
    },
    [socket, is_connected],
  );

  return {
    startTyping,
    stopTyping,
  };
};
