"use client";

import { useCallback } from "react";
import type { Socket } from "socket.io-client";
import { SUPPORT_CHAT_ID } from "./constants";

interface UseHistoryActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseHistoryActionsReturn {
  getHistory: (skip?: number, take?: number) => void;
}

export const useHistoryActions = (
  options: UseHistoryActionsOptions,
): UseHistoryActionsReturn => {
  const { socket, is_connected } = options;

  const getHistory = useCallback(
    (skip: number = 0, take: number = 50) => {
      if (!socket || !is_connected) return;
      console.log("Getting history for support chat");
      socket.emit("get_history", { chat_partner_id: SUPPORT_CHAT_ID, skip, take });
    },
    [socket, is_connected],
  );

  return {
    getHistory,
  };
};

