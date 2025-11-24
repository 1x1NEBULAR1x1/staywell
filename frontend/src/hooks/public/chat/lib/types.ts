import type { Message } from "@shared/src/database";

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
  onUserOnlineStatus?: (data: { user_id: string; last_seen: Date | null }) => void;
}

export interface UseWebSocketChatReturn {
  // Connection
  is_connected: boolean;
  connect: () => Promise<void>;
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

