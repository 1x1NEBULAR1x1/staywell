"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "@/hooks/common/useAccount";
import type { UseWebSocketChatOptions, UseWebSocketChatReturn } from ".";
import { useChatStore, WS_DISCONNECT_REASONS } from ".";
import { useChatActions } from "./useChatActions";
import { useHistoryActions } from "./useHistoryActions";
import { useMessageActions } from "./useMessageActions";
import { useTypingActions } from "./useTypingActions";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { useWebSocketEventHandlers } from "./useWebSocketEventHandlers";
import { useQPId } from "@/hooks/common/useId";

export const useAdminChat = (
  options: UseWebSocketChatOptions = {},
): UseWebSocketChatReturn => {
  const { onNewMessage, onMessageEdited, onUserTyping, onUserOnlineStatus } =
    options;
  const chatStore = useChatStore();
  const { user } = useAccount();
  const selected_chat_id = useQPId();
  const chatsLoadedRef = useRef(false);
  const [typing_users, setTypingUsers] = useState<Set<string>>(new Set());

  const handleUserTyping = useCallback(
    (data: {
      user_id: string;
      chat_partner_id: string;
      is_typing: boolean;
    }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.is_typing) {
          newSet.add(data.user_id);
        } else {
          newSet.delete(data.user_id);
        }
        return newSet;
      });
    },
    [],
  );

  // WebSocket connection management
  const connection = useWebSocketConnection({
    onConnect: () => chatStore.setIsConnected(true),
    onDisconnect: (reason) => {
      chatStore.setIsConnected(false);
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

  // Chat actions
  const chatActions = useChatActions(connection);

  // Message actions
  const messageActions = useMessageActions(connection);

  // History actions
  const historyActions = useHistoryActions(connection);

  // Typing actions
  const typingActions = useTypingActions(connection);

  const isTyping = useCallback(
    (user_id: string) => {
      return typing_users.has(user_id);
    },
    [typing_users],
  );

  // Event handlers
  useWebSocketEventHandlers({
    ...connection,
    selected_chat_id,
    getHistory: historyActions.getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping: handleUserTyping,
    onUserOnlineStatus,
  });

  const connectRef = useRef(connection.connect);

  // Keep connect ref updated
  useEffect(() => {
    connectRef.current = connection.connect;
  }, [connection.connect]);

  // Auto-connect on mount if user is authenticated
  useEffect(() => {
    if (user && !connection.is_connected) {
      connectRef.current().catch(console.error);
    }
  }, [user, connection.is_connected]);

  // Load chats when connected
  useEffect(() => {
    if (connection.is_connected && user && !chatsLoadedRef.current) {
      console.log("Connection established, loading chats");
      chatsLoadedRef.current = true;
      // Small delay to ensure connection is fully established
      const timer = setTimeout(() => {
        historyActions.getChats();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [connection.is_connected, user]);


  // Reset chats loaded flag when disconnected
  useEffect(() => {
    if (!connection.is_connected) {
      chatsLoadedRef.current = false;
    }
  }, [connection.is_connected]);

  // Helper function to get user last seen time
  const getUserLastSeen = useCallback((userId: string) => {
    const lastSeenTimestamp = chatStore.online_users[userId];
    if (!lastSeenTimestamp) return null;
    return new Date(lastSeenTimestamp);
  }, [chatStore.online_users]);

  // Periodically update online status of users in chats based on last seen time
  useEffect(() => {
    const interval = setInterval(() => {
      chatStore.setChats(
        chatStore.chats.map(chat => {
          const lastSeen = chat.last_seen;
          const isOnline = lastSeen ? (Date.now() - new Date(lastSeen).getTime()) < 5 * 60 * 1000 : false;
          return { ...chat, is_online: isOnline };
        })
      );
    }, 30 * 1000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []); // No dependencies needed as setChats is stable

  // Sort users by last message time
  const chats = useMemo(() => {
    const users = chatStore.chats.sort((a, b) => {
      if (!a.last_message && !b.last_message) return 0;
      if (!a.last_message) return 1;
      if (!b.last_message) return -1;
      return (
        new Date(b.last_message.created).getTime() -
        new Date(a.last_message.created).getTime()
      );
    });
    if (!chatStore.search_query.trim()) return users;
    const query = chatStore.search_query.toLowerCase();
    return users.filter((user) => {
      const full_name = `${user.user.first_name} ${user.user.last_name}`.toLowerCase();
      return full_name.includes(query);
    });
  }, [chatStore.chats, chatStore.search_query]);



  return useMemo(
    () => ({
      // UI State & data
      ...chatStore,

      // Connection
      ...connection,
      connect: connectRef.current,

      // Chat management
      ...chatActions,

      // Messages
      ...messageActions,

      // History
      ...historyActions,
      chats,

      // Online status
      getUserLastSeen,

      // Typing
      ...typingActions,
      isTyping,
    }),
    [
      chatStore.is_collapsed,
      chatStore.toggleCollapse,
      connection.is_connected,
      connection.disconnect,
      chatActions.joinChat,
      chatActions.leaveChat,
      messageActions.sendMessage,
      messageActions.editMessage,
      messageActions.deleteMessage,
      messageActions.markMessagesAsRead,
      historyActions.getHistory,
      historyActions.getChats,
      typingActions.startTyping,
      typingActions.stopTyping,
      chatStore.chats,
      chatStore.messages,
      chatStore.online_users,
      getUserLastSeen,
      isTyping,
    ],
  );
};
