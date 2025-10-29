import type { Message } from "@shared/src/database";
import { UserWithoutPassword } from "@shared/src";

export interface ChatWithLastMessage {
  user: UserWithoutPassword;
  last_message: Message | null;
  unread_count: number;
  is_online: boolean;
}

export interface UseWebSocketChatOptions {
  onNewMessage?: (message: Message) => void;
  onMessageEdited?: (message: Message) => void;
  onMessageDeleted?: (messageId: string) => void;
  onMessagesRead?: (data: {
    reader_id: string;
    chat_partner_id: string;
  }) => void;
  onUserTyping?: (data: {
    user_id: string;
    chat_partner_id: string;
    is_typing: boolean;
  }) => void;
  onUserOnlineStatus?: (data: { user_id: string; is_online: boolean }) => void;
}

export interface UseWebSocketChatReturn {
  // UI State
  is_collapsed: boolean;
  toggleCollapse: () => void;
  search_query: string;
  setSearchQuery: (search_query: string) => void;

  // Connection
  is_connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;

  // Chat management
  selectChat: (chat_id: string | null) => void;
  selected_chat_id: string | null;
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
  getChats: (skip?: number, take?: number) => void;
  chats: ChatWithLastMessage[];


  // Typing
  startTyping: (chat_partner_id: string) => void;
  stopTyping: (chat_partner_id: string) => void;
  isTyping: (user_id: string) => boolean;

  // Data
  messages: Message[];
  online_users: string[];
}
