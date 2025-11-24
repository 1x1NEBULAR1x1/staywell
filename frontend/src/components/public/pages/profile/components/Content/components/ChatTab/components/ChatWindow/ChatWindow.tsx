"use client";

import { useCallback, useState } from "react";
import { useChat } from "@/hooks/public/chat";
import classes from "./ChatWindow.module.scss";
import { ChatInput, ChatMessages, ChatWindowHeader } from "./components";

export const ChatWindow = () => {
  const [should_scroll, setShouldScroll] = useState(true);
  const [message_input, setMessageInput] = useState("");

  const { sendMessage, startTyping, stopTyping } = useChat();

  const handleSendMessage = useCallback(async () => {
    if (!message_input.trim()) return;

    const message_text = message_input.trim();

    // Clear input and set scroll flag BEFORE sending
    setMessageInput("");
    setShouldScroll(true);

    // Stop typing indicator when sending message
    stopTyping();

    try {
      sendMessage(message_text);
    } catch (error) {
      // Return message back to input on error
      setMessageInput(message_text);
      // Resume typing indicator if input is not empty
      if (message_text.trim()) {
        startTyping();
      }
      console.error("Failed to send message:", error);
    }
  }, [message_input, sendMessage, stopTyping, startTyping]);

  const handleMessageChange = useCallback(
    (value: string) => {
      setMessageInput(value);

      // Manage typing indicator
      if (value.trim()) {
        startTyping();
      } else {
        stopTyping();
      }
    },
    [startTyping, stopTyping],
  );

  const handleScrollComplete = useCallback(() => {
    setShouldScroll(false);
  }, []);

  return (
    <div className={classes.window}>
      <ChatWindowHeader />

      <ChatMessages
        is_loading={false}
        should_scroll={should_scroll}
        onScrollComplete={handleScrollComplete}
      />

      <ChatInput
        message_value={message_input}
        is_sending={false}
        onMessageChange={handleMessageChange}
        onSend={handleSendMessage}
      />
    </div>
  );
};

