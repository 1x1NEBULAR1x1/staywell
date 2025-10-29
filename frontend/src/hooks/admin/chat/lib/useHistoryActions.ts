"use client";

import { useCallback } from "react";
import type { Socket } from "socket.io-client";

interface UseHistoryActionsOptions {
  socket: Socket | null;
  is_connected: boolean;
}

interface UseHistoryActionsReturn {
  getHistory: (chat_partner_id: string, skip?: number, take?: number) => void;
  getChats: (skip?: number, take?: number) => void;
}

export const useHistoryActions = (
  options: UseHistoryActionsOptions,
): UseHistoryActionsReturn => {
  const { socket, is_connected } = options;

  const getHistory = useCallback(
    (chat_partner_id: string, skip: number = 0, take: number = 50) => {
      if (!socket || !is_connected) return;
      socket.emit("get_history", { chat_partner_id, skip, take });
    },
    [socket, is_connected],
  );

  const getChats = useCallback(
    (skip: number = 0, take: number = 50) => {
      if (!socket || !is_connected) {
        console.log("getChats: socket not connected", { socket: !!socket, is_connected });
        return;
      }
      console.log("getChats: emitting get_chats", { skip, take });
      socket.emit("get_chats", { skip, take });
    },
    [socket, is_connected],
  );

  return {
    getHistory,
    getChats,
  };
};
