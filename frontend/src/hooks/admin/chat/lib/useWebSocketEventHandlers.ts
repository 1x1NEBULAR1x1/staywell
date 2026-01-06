"use client";

import type { Message } from "@shared/src/database";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useAccount } from "@/hooks/common/useAccount";
import type { ChatWithLastMessage } from ".";
import { useChatStore } from ".";

/**
 * Sort messages by creation time
 */
function sortMessagesByCreationTime(a: Message, b: Message): number {
  return new Date(a.created).getTime() - new Date(b.created).getTime();
}

/**
 * Filter messages to show only the latest version of each message chain
 * Handles complex replacement chains by finding the true root and latest version
 */
function filterLatestMessageVersions(messages: Message[]): Message[] {
  console.log(
    "🔄 Filtering messages:",
    messages.map((m) => ({
      id: m.id,
      replace_to: m.replace_to,
      message: `${m.message.substring(0, 20)}...`,
      created: m.created,
    })),
  );

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

  console.log(
    "📊 Root chains:",
    Array.from(rootChains.entries()).map(([rootId, chain]) => ({
      rootId,
      count: chain.length,
      messages: chain.map((m) => ({
        id: m.id,
        replace_to: m.replace_to,
        created: m.created,
      })),
    })),
  );

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

    console.log(`🎯 Selected for root ${rootId}:`, {
      latest: latestMessage.id,
      rootMessage: rootMessage?.id,
      filtered: filteredMessage.id,
      originalCreated: rootMessage?.created,
      finalCreated: filteredMessage.created,
    });

    filteredMessages.push(filteredMessage);
  }

  // Sort all filtered messages by creation time
  filteredMessages.sort(
    (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
  );

  console.log(
    "🎯 Final filtered messages:",
    filteredMessages.map((m) => ({
      id: m.id,
      replace_to: m.replace_to,
      message: `${m.message.substring(0, 20)}...`,
      created: m.created,
    })),
  );

  return filteredMessages;
}

interface UseWebSocketEventHandlersOptions {
  socket: Socket | null;
  selected_chat_id: string | null;
  getHistory?: (chat_partner_id: string, skip?: number, take?: number) => void;
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
    selected_chat_id,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
  } = options;

  const { user } = useAccount();
  const store = useChatStore();
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
        console.log("🔄 Processing edited message:", {
          newMessageId: new_message.id,
          replaces: new_message.replace_to,
          message: `${new_message.message.substring(0, 50)}...`,
        });

        // Find message to replace by matching replace_to
        const messageToReplace = existing_messages.find(
          (msg) => msg.replace_to === new_message.replace_to,
        );

        console.log(
          "📋 Existing messages replace_to values:",
          existing_messages.map((m) => ({
            id: m.id,
            replace_to: m.replace_to,
          })),
        );

        if (messageToReplace) {
          console.log(
            "✅ Found message to replace:",
            messageToReplace.id,
            "at position with created:",
            messageToReplace.created,
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
          console.log("🔄 Message replaced successfully");
        } else {
          console.warn(
            "❌ Received edited message but could not find message to replace:",
            new_message.replace_to,
          );
          console.log(
            "📋 All existing messages:",
            existing_messages.map((m) => ({
              id: m.id,
              replace_to: m.replace_to,
              created: m.created,
            })),
          );
          // Add as new message for now (shouldn't happen in normal flow)
          updated_messages = [...existing_messages, new_message];
        }
      } else {
        // Check if this is a replacement for an optimistic message
        const optimistic_index = existing_messages.findIndex(
          (msg) =>
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
        updated_messages.sort(sortMessagesByCreationTime),
      );

      // If this message is for the currently selected chat, reload history to ensure sync
      const sender_id = data.message.sender_id;
      const receiver_id = data.message.receiver_id;
      const chat_partner_id = sender_id === user?.id ? receiver_id : sender_id;

      if (selected_chat_id === chat_partner_id && getHistory) {
        console.log(
          "New message received for selected chat, reloading history",
        );
        getHistory(chat_partner_id);
      }

      // Avoid duplicates
      onNewMessage?.(data.message);
    });

    socket.on("message_edited", (data: { message: Message }) => {
      store_ref.current.setMessages(
        store_ref.current.messages
          .map((m: Message) => (m.id === data.message.id ? data.message : m))
          .sort(sortMessagesByCreationTime),
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
        console.log("📚 History loaded:", {
          chat_partner_id: data.chat_partner_id,
          skip: data.skip,
          total: data.total,
          itemsCount: data.items.length,
          items: data.items.map((m) => ({
            id: m.id,
            replace_to: m.replace_to,
            message: `${m.message.substring(0, 30)}...`,
            created: m.created,
          })),
        });

        if (data.skip === 0) {
          // First load or refresh - replace all messages
          // Filter to show only latest versions of edited messages
          const filteredMessages = filterLatestMessageVersions(data.items);
          const sortedFilteredMessages = filteredMessages.sort(
            sortMessagesByCreationTime,
          );
          console.log(
            "🔍 Filtered and sorted messages:",
            sortedFilteredMessages.map((m) => ({
              id: m.id,
              replace_to: m.replace_to,
              message: `${m.message.substring(0, 30)}...`,
              created: m.created,
            })),
          );
          store_ref.current.setMessages(sortedFilteredMessages);
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
          const sortedFilteredMessages = filteredMessages.sort(
            sortMessagesByCreationTime,
          );
          store_ref.current.setMessages(sortedFilteredMessages);
        }
      },
    );

    // Chats loaded
    socket.on(
      "chats_loaded",
      (data: { items: ChatWithLastMessage[]; total: number }) => {
        // Initialize online_users with data from loaded chats
        const new_online_users = { ...store_ref.current.online_users };
        data.items.forEach((chat) => {
          if (chat.last_seen) {
            // Set last seen time from server data
            new_online_users[chat.user.id] = new Date(chat.last_seen).getTime();
          }
        });

        store_ref.current.setOnlineUsers(new_online_users);

        store_ref.current.setChats(data.items);
      },
    );

    // Chats updated (when new messages arrive or read status changes)
    socket.on("chats_updated", () => {
      // Refresh the chats list when it gets updated
      if (store_ref.current.chats.length > 0) {
        socket.emit("get_chats", { skip: 0, take: 50 });
      }
    });

    // Typing events
    socket.on(
      "user_typing",
      (data: {
        user_id: string;
        chat_partner_id: string;
        is_typing: boolean;
      }) => {
        onUserTyping?.(data);
      },
    );

    // Online status events
    socket.on(
      "user_online_status",
      (data: { user_id: string; last_seen: Date | null }) => {
        store_ref.current.updateUserLastSeen(data.user_id, data.last_seen);
        onUserOnlineStatus?.(data);
      },
    );

    return () => {
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("history_loaded");
      socket.off("chats_loaded");
      socket.off("chats_updated");
      socket.off("user_typing");
      socket.off("user_online_status");
    };
  }, [
    socket,
    selected_chat_id,
    getHistory,
    onNewMessage,
    onMessageEdited,
    onUserTyping,
    onUserOnlineStatus,
    user?.id,
  ]);
};
