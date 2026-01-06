"use client";

import type { Message } from "@shared/src/database";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useUserChatStore } from ".";
import { SUPPORT_CHAT_ID } from "./constants";

/**
 * Filter messages to show only the latest version of each message chain
 * Handles complex replacement chains by finding the true root and latest version
 */
function filterLatestMessageVersions(messages: Message[]): Message[] {
  // Create a map for quick lookup
  const messageMap = new Map<string, Message>();
  for (const message of messages) {
    messageMap.set(message.id, message);
  }

  // Find the true root for each message (follow replace_to chain)
  function findRootId(messageId: string): string {
    const message = messageMap.get(messageId);
    if (!message || !message.replace_to) {
      return messageId; // This is a root message
    }
    return findRootId(message.replace_to); // Recursively find the root
  }

  // Group messages by their true root ID
  const rootChains = new Map<string, Message[]>();
  for (const message of messages) {
    const rootId = findRootId(message.id);
    if (!rootChains.has(rootId)) {
      rootChains.set(rootId, []);
    }
    rootChains.get(rootId)?.push(message);
  }

  // For each root chain, select only the latest message
  const filteredMessages: Message[] = [];
  for (const [rootId, chain] of rootChains) {
    // Sort by creation time, latest first
    chain.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
    const latestMessage = chain[0]; // Most recent message in the chain

    // Find the original root message to preserve its creation time
    const rootMessage = messageMap.get(rootId);
    const filteredMessage = {
      ...latestMessage,
      created: rootMessage ? rootMessage.created : latestMessage.created,
      edited:
        chain.length > 1
          ? latestMessage.edited || new Date(latestMessage.created)
          : latestMessage.edited, // Preserve or set edited timestamp
      replace_to: rootId, // Set replace_to to the true root for identification
    };

    filteredMessages.push(filteredMessage);
  }

  // Sort all filtered messages by creation time
  filteredMessages.sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
  );

  return filteredMessages;
}

interface UseWebSocketEventHandlersOptions {
  socket: Socket | null;
  getHistory?: (skip?: number, take?: number) => void;
  onNewMessage?: (message: Message) => void;
  onMessageEdited?: (message: Message) => void;
  onUserTyping?: (data: {
    user_id: string;
    chat_partner_id: string;
    is_typing: boolean;
  }) => void;
  onUserOnlineStatus?: (data: {
    user_id: string;
    last_seen: Date | null;
  }) => void;
}

export const useWebSocketEventHandlers = (
  options: UseWebSocketEventHandlersOptions,
) => {
  const {
    socket,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
  } = options;

  const store = useUserChatStore();
  const store_ref = useRef(store);
  store_ref.current = store;

  useEffect(() => {
    if (!socket) return;

    // Message events
    socket.on("new_message", (data: { message: Message }) => {
      const existing_messages = store_ref.current.messages;
      const new_message = data.message;

      let updated_messages: Message[];

      // Check if this is an edited message (has replace_to)
      if (new_message.replace_to) {
        console.log("🔄 [USER CHAT] Processing edited message:", {
          newMessageId: new_message.id,
          replaces: new_message.replace_to,
          message: `${new_message.message.substring(0, 50)}...`,
        });

        // Find message to replace by matching replace_to
        const messageToReplace = existing_messages.find(
          (msg) => msg.replace_to === new_message.replace_to,
        );

        if (messageToReplace) {
          console.log(
            "✅ [USER CHAT] Found message to replace:",
            messageToReplace.id,
          );
          // Replace the found message with the new edited version
          // Preserve the original creation time to maintain position
          const editedMessage = {
            ...new_message,
            created: messageToReplace.created,
          };
          updated_messages = existing_messages.map((msg: Message) =>
            msg.id === messageToReplace.id ? editedMessage : msg,
          );
        } else {
          console.warn(
            "❌ [USER CHAT] Received edited message but could not find message to replace:",
            new_message.replace_to,
          );
          // Add as new message
          updated_messages = [...existing_messages, new_message];
        }
      } else {
        // Check if this is a replacement for an optimistic message
        const optimistic_index = existing_messages.findIndex(
          (msg: Message) =>
            msg.id.startsWith("temp-") && // optimistic messages have temp IDs
            msg.sender_id === new_message.sender_id &&
            msg.message === new_message.message &&
            Math.abs(
              new Date(msg.created).getTime() -
                new Date(new_message.created).getTime(),
            ) < 5000, // within 5 seconds
        );

        if (optimistic_index !== -1) {
          // Replace optimistic message with real one
          updated_messages = [...existing_messages];
          updated_messages[optimistic_index] = new_message;
        } else {
          // Add new message
          updated_messages = [...existing_messages, new_message];
        }
      }

      store_ref.current.setMessages(
        updated_messages.sort(
          (a: Message, b: Message) =>
            new Date(a.created).getTime() - new Date(b.created).getTime(),
        ),
      );

      // Reload history to ensure sync
      if (getHistory) {
        console.log("New message received, reloading history");
        getHistory();
      }

      onNewMessage?.(data.message);
    });

    socket.on("message_edited", (data: { message: Message }) => {
      store_ref.current.setMessages(
        store_ref.current.messages
          .map((m: Message) => (m.id === data.message.id ? data.message : m))
          .sort(
            (a: Message, b: Message) =>
              new Date(a.created).getTime() - new Date(b.created).getTime(),
          ),
      );
      onMessageEdited?.(data.message);
    });

    socket.on("message_deleted", (data: { message_id: string }) => {
      store_ref.current.setMessages(
        store_ref.current.messages.filter(
          (m: Message) => m.id !== data.message_id,
        ),
      );
    });

    // History loaded
    socket.on(
      "history_loaded",
      (data: {
        items: Message[];
        total: number;
        skip: number;
        chat_partner_id: string;
      }) => {
        if (data.chat_partner_id !== SUPPORT_CHAT_ID) return;

        if (data.skip === 0) {
          // First load or refresh - replace all messages
          // Filter to show only latest versions of edited messages
          const filteredMessages = filterLatestMessageVersions(data.items);
          store_ref.current.setMessages(filteredMessages);
        } else {
          // Pagination - merge all messages and filter duplicates
          // Create a map of all messages by ID to handle updates
          const allMessagesMap = new Map<string, Message>();

          // Add existing messages
          store_ref.current.messages.forEach((msg) => {
            allMessagesMap.set(msg.id, msg);
          });

          // Add or update with new messages
          data.items.forEach((msg) => {
            allMessagesMap.set(msg.id, msg);
          });

          // Convert back to array and filter
          const all_messages = Array.from(allMessagesMap.values());
          const filteredMessages = filterLatestMessageVersions(all_messages);
          store_ref.current.setMessages(filteredMessages);
        }
      },
    );

    // Typing events
    socket.on(
      "user_typing",
      (data: {
        user_id: string;
        chat_partner_id: string;
        is_typing: boolean;
      }) => {
        // Only handle typing from support
        if (data.user_id === SUPPORT_CHAT_ID) {
          store_ref.current.setIsTyping(data.is_typing);
        }
        onUserTyping?.(data);
      },
    );

    // Online status events
    socket.on(
      "user_online_status",
      (data: { user_id: string; last_seen: Date | null }) => {
        // Only handle status from support
        if (data.user_id === SUPPORT_CHAT_ID) {
          store_ref.current.setSupportLastSeen(data.last_seen);
        }
        onUserOnlineStatus?.(data);
      },
    );

    return () => {
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("history_loaded");
      socket.off("user_typing");
      socket.off("user_online_status");
    };
  }, [
    socket,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
  ]);
};
