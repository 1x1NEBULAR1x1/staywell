// Chat-related constants

export const WS_RECONNECTION_ATTEMPTS = 5;
export const WS_RECONNECTION_DELAY = 1000;
export const TOKEN_VALIDITY_BUFFER = 2 * 60 * 1000; // 2 minutes in milliseconds
export const RECONNECT_DELAY = 1000; // 1 second

export const WS_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  CONNECTED: "connected",
  ERROR: "error",

  // Message events
  NEW_MESSAGE: "new_message",
  MESSAGE_EDITED: "message_edited",

  // Chat events
  CHATS_LOADED: "chats_loaded",

  // Typing events
  USER_TYPING: "user_typing",

  // Online status events
  USER_ONLINE_STATUS: "user_online_status",

  // Action events
  JOIN_CHAT: "join_chat",
  LEAVE_CHAT: "leave_chat",
  SEND_MESSAGE: "send_message",
  EDIT_MESSAGE: "edit_message",
  DELETE_MESSAGE: "delete_message",
  MARK_MESSAGES_READ: "mark_messages_read",
  GET_HISTORY: "get_history",
  GET_CHATS: "get_chats",
  TYPING_START: "typing_start",
  TYPING_STOP: "typing_stop",
} as const;

export const WS_DISCONNECT_REASONS = {
  SERVER_DISCONNECT: "io server disconnect",
  CLIENT_DISCONNECT: "io client disconnect",
};
