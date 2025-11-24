"use client";

import type { Message } from "@shared/src/database";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { useUserChat } from "@/hooks/public/chat/lib/useUserChat";

interface UserChatContextType {
  // Connection
  is_connected: boolean;
  connect: () => void;
  disconnect: () => void;

  // Messages
  sendMessage: (message: string, booking_id?: string) => void;
  editMessage: (message_id: string, new_message: string) => void;
  deleteMessage: (message_id: string) => void;
  markMessagesAsRead: () => void;

  // History
  getHistory: (skip?: number, take?: number) => void;

  // Typing
  startTyping: () => void;
  stopTyping: () => void;
  isTyping: boolean;

  // Data
  messages: Message[];
  support_online: boolean;
  support_last_seen: Date | null;
}

const UserChatContext = createContext<UserChatContextType | null>(null);

interface UserChatProviderProps {
  children: ReactNode;
}

export const UserChatProvider = ({ children }: UserChatProviderProps) => {
  // Single WebSocket instance for entire chat
  const userChat = useUserChat({
    onNewMessage: () => {
      console.log("onNewMessage: new message received");
    },
    onMessageEdited: () => {
      console.log("onMessageEdited: message edited");
    },
    onMessageDeleted: () => {
      console.log("onMessageDeleted: message deleted");
    },
  });

  const contextValue = useMemo(
    () => ({
      ...userChat,
    }),
    [userChat],
  );

  return (
    <UserChatContext.Provider value={contextValue}>
      {children}
    </UserChatContext.Provider>
  );
};

export const useUserChatContext = () => {
  const context = useContext(UserChatContext);
  if (!context) {
    throw new Error("useUserChatContext must be used within UserChatProvider");
  }
  return context;
};

