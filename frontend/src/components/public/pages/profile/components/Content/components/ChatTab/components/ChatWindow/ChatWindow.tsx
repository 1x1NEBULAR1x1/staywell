"use client";

import { useCallback, useEffect, useState } from "react";
import { useChat } from "@/hooks/public/chat";
import classes from "./ChatWindow.module.scss";
import { ChatInput, ChatMessages, ChatWindowHeader } from "./components";

export const ChatWindow = () => {
  const [should_scroll, setShouldScroll] = useState(true);
  const [message_input, setMessageInput] = useState("");
  const [is_loading, setIsLoading] = useState(true);

  const { sendMessage, startTyping, stopTyping, getHistory, is_connected } =
    useChat();

  // Load history when component mounts and connection is established
  useEffect(() => {
    if (is_connected) {
      setIsLoading(true);
      setShouldScroll(true);
      getHistory(0, 100);
      // Set loading to false after a short delay to allow messages to load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [is_connected, getHistory]);

  const handleSendMessage = useCallback(async () => {
    if (!message_input.trim() || !is_connected) {
      if (!is_connected) {
        console.warn("Cannot send message: WebSocket not connected");
      }
      return;
    }

    const message_text = message_input.trim();

    // Clear input and set scroll flag BEFORE sending
    setMessageInput("");
    setShouldScroll(true);

    // Stop typing indicator when sending message
    stopTyping();

    try {
      console.log("Attempting to send message:", message_text);
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
  }, [message_input, sendMessage, stopTyping, startTyping, is_connected]);

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
        is_loading={is_loading}
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
