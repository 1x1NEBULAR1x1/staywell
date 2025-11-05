"use client";

import type { Message } from "@shared/src/database";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useAdminChat } from "@/hooks/admin/chat/lib/useAdminChat";
import type { ChatWithLastMessage } from "@/hooks/admin/chat/lib";

interface AdminChatContextType {
  // Ui State
  is_collapsed: boolean;
  toggleCollapse: () => void;
  search_query: string;
  setSearchQuery: (query: string) => void;

  // Connection
  is_connected: boolean;
  connect: () => void;
  disconnect: () => void;

  // Chat management
  joinChat: (chat_partner_id: string) => void;
  leaveChat: (chat_partner_id: string) => void;

  // Messages
  sendMessage: (
    receiver_id: string,
    message: string,
    booking_id?: string,
  ) => void;
  editMessage: (message_id: string, new_message: string) => void;
  deleteMessage: (message_id: string) => void;
  markMessagesAsRead: (chat_partner_id: string) => void;

  // History
  getHistory: (chat_partner_id: string, skip?: number, take?: number) => void;

  // Typing
  startTyping: (chat_partner_id: string) => void;
  stopTyping: (chat_partner_id: string) => void;
  isTyping: (user_id: string) => boolean;

  // Data
  chats: ChatWithLastMessage[];
  getChats: (skip?: number, take?: number) => void;
  getUserLastSeen: (userId: string) => Date | null;

  messages: Message[];
  online_users: Record<string, number>;
}

const AdminChatContext = createContext<AdminChatContextType | null>(null);

interface AdminChatProviderProps {
  children: ReactNode;
}

export const AdminChatProvider = ({ children }: AdminChatProviderProps) => {
  const getChatsRef = useRef<(() => void) | undefined>(undefined);

  // Single WebSocket instance for entire chat
  const adminChat = useAdminChat({
    onNewMessage: () => {
      console.log("onNewMessage: refreshing chats");
      getChatsRef.current?.();
    },
    onMessageEdited: () => {
      console.log("onMessageEdited: refreshing chats");
      getChatsRef.current?.();
    },
    onMessageDeleted: () => {
      console.log("onMessageDeleted: refreshing chats");
      getChatsRef.current?.();
    },
  });

  // Update getChats ref after webSocketChat is created
  useEffect(() => {
    getChatsRef.current = adminChat.getChats;
  }, [adminChat.getChats]);

  const contextValue = useMemo(
    () => ({
      ...adminChat,
    }),
    [adminChat],
  );

  return (
    <AdminChatContext.Provider value={contextValue}>{children}</AdminChatContext.Provider>
  );
};

export const useAdminChatContext = () => {
  const context = useContext(AdminChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};
