"use client";

import { useCallback, useEffect, useState } from "react";
import { useChatStore } from "@/hooks/admin/chat/lib/useChatStore";
import { useUsers } from "@/hooks/admin/queries";
import { useAccount } from "@/hooks/common/useAccount";
import { useChat } from "@/hooks/admin/chat/useChat";
import classes from "./ChatWindow.module.scss";
import { ChatInput, ChatMessages, ChatWindowHeader } from "./components";

export const ChatWindow = () => {
  const [should_scroll, setShouldScroll] = useState(true);
  const [message_input, setMessageInput] = useState("");

  const { selected_chat_id, sendMessage, startTyping, stopTyping } = useChat();
  const { data: selected_user } = useUsers().find(selected_chat_id || "", { enabled: selected_chat_id !== null });


  // Scroll to bottom when chat is selected
  useEffect(() => {
    if (selected_chat_id) {
      setShouldScroll(true);
    }
  }, [selected_chat_id]);

  const handleSendMessage = useCallback(async () => {
    if (!message_input.trim() || !selected_chat_id) return;

    const message_text = message_input.trim();

    // Clear input and set scroll flag BEFORE sending
    setMessageInput("");
    setShouldScroll(true);

    // Stop typing indicator when sending message
    stopTyping(selected_chat_id);

    try {
      sendMessage(selected_chat_id, message_text);
    } catch (error) {
      // Return message back to input on error
      setMessageInput(message_text);
      // Resume typing indicator if input is not empty
      if (message_text.trim()) {
        startTyping(selected_chat_id);
      }
      console.error("Failed to send message:", error);
    }
  }, [message_input, selected_chat_id, sendMessage, stopTyping, startTyping]);

  const handleMessageChange = useCallback(
    (value: string) => {
      setMessageInput(value);

      // Manage typing indicator
      if (value.trim() && selected_chat_id) {
        startTyping(selected_chat_id);
      } else if (selected_chat_id) {
        stopTyping(selected_chat_id);
      }
    },
    [selected_chat_id, startTyping, stopTyping],
  );

  const handleScrollComplete = useCallback(() => {
    setShouldScroll(false);
  }, []);

  if (!selected_chat_id || !selected_user) {
    return null;
  }

  const avatar_url = selected_user.image || "/common/default-avatar.png";

  return (
    <div className={classes.window}>
      <ChatWindowHeader selected_user={selected_user} />

      <ChatMessages
        is_loading={false}
        has_next_page={false}
        is_fetching_next_page={false}
        selected_user_avatar={avatar_url}
        should_scroll={should_scroll}
        onLoadMore={() => { }} // No pagination for now
        onScrollComplete={handleScrollComplete}
      />

      <ChatInput
        message_value={message_input}
        is_sending={false} // WebSocket handles sending status differently
        onMessageChange={handleMessageChange}
        onSend={handleSendMessage}
      />
    </div>
  );
};
