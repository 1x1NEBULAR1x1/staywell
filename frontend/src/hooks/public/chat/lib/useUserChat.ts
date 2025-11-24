"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAccount } from "@/hooks/common/useAccount";
import type { UseWebSocketChatOptions, UseWebSocketChatReturn } from ".";
import { useUserChatStore, WS_DISCONNECT_REASONS } from ".";
import { useChatActions } from "./useChatActions";
import { useHistoryActions } from "./useHistoryActions";
import { useMessageActions } from "./useMessageActions";
import { useTypingActions } from "./useTypingActions";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { useWebSocketEventHandlers } from "./useWebSocketEventHandlers";

export const useUserChat = (
  options: UseWebSocketChatOptions = {},
): UseWebSocketChatReturn => {
  const { onNewMessage, onMessageEdited, onUserTyping, onUserOnlineStatus } =
    options;
  const chatStore = useUserChatStore();
  const { user } = useAccount();
  const hasConnectedRef = useRef(false);

  const handleUserTyping = useCallback(
    (data: {
      user_id: string;
      chat_partner_id: string;
      is_typing: boolean;
    }) => {
      chatStore.setIsTyping(data.is_typing);
    },
    [chatStore],
  );

  // WebSocket connection management
  const connection = useWebSocketConnection({
    onConnect: () => {
      chatStore.setIsConnected(true);
      // Auto-join support chat after connection
      if (!hasConnectedRef.current) {
        hasConnectedRef.current = true;
        console.log("Connected to chat, joining support chat");
        setTimeout(() => {
          chatActions.joinSupportChat();
        }, 500);
      }
    },
    onDisconnect: (reason) => {
      chatStore.setIsConnected(false);
      hasConnectedRef.current = false;
      if (Object.values(WS_DISCONNECT_REASONS).includes(reason)) {
        connection.refreshTokenAndReconnect();
      }
    },
    onConnectError: (error) => {
      if (["authentication", "token"].some((message) => error.message?.includes(message))) {
        connection.refreshTokenAndReconnect();
      }
    },
  });

  // History actions
  const historyActions = useHistoryActions(connection);

  // Chat actions
  const chatActions = useChatActions({
    ...connection,
    getHistory: historyActions.getHistory,
  });

  // Message actions
  const messageActions = useMessageActions(connection);

  // Typing actions
  const typingActions = useTypingActions(connection);

  // WebSocket event handlers
  useWebSocketEventHandlers({
    socket: connection.socket,
    getHistory: historyActions.getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping: (data) => {
      handleUserTyping(data);
      onUserTyping?.(data);
    },
    onUserOnlineStatus,
  });

  // Auto-connect when user is available
  const connectRef = useRef<(() => Promise<void>) | undefined>(undefined);
  useEffect(() => {
    connectRef.current = connection.connect;
  }, [connection.connect]);

  useEffect(() => {
    if (user && !connection.is_connected && connectRef.current) {
      console.log("User available, connecting to chat");
      connectRef.current().catch(console.error);
    }
  }, [user, connection.is_connected]);

  // Check if support is online (last seen within last 5 minutes)
  const support_online = useMemo(() => {
    if (!chatStore.support_last_seen) return false;
    const lastSeenTime = new Date(chatStore.support_last_seen).getTime();
    const now = Date.now();
    return now - lastSeenTime < 5 * 60 * 1000; // 5 minutes
  }, [chatStore.support_last_seen]);

  return useMemo(
    () => ({
      // Connection
      is_connected: chatStore.is_connected,
      connect: connectRef.current || (async () => {}),
      disconnect: connection.disconnect,

      // Messages
      sendMessage: messageActions.sendMessage,
      editMessage: messageActions.editMessage,
      deleteMessage: messageActions.deleteMessage,
      markMessagesAsRead: messageActions.markMessagesAsRead,

      // History
      getHistory: historyActions.getHistory,

      // Typing
      startTyping: typingActions.startTyping,
      stopTyping: typingActions.stopTyping,
      isTyping: chatStore.is_typing,

      // Data
      messages: chatStore.messages,
      support_online,
      support_last_seen: chatStore.support_last_seen,
    }),
    [
      chatStore.is_connected,
      chatStore.messages,
      chatStore.is_typing,
      chatStore.support_last_seen,
      connection.disconnect,
      messageActions.sendMessage,
      messageActions.editMessage,
      messageActions.deleteMessage,
      messageActions.markMessagesAsRead,
      historyActions.getHistory,
      typingActions.startTyping,
      typingActions.stopTyping,
      support_online,
    ],
  );
};

