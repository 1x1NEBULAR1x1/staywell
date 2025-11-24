import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "../MessageBubble";
import classes from "./ChatMessages.module.scss";
import { useAccount } from "@/hooks/common/useAccount";
import { useChat } from "@/hooks/public/chat";
import default_avatar from "@/../public/common/default-avatar.png";

interface ChatMessagesProps {
  is_loading: boolean;
  should_scroll: boolean;
  onScrollComplete: () => void;
}

export const ChatMessages = ({
  is_loading,
  should_scroll,
  onScrollComplete,
}: ChatMessagesProps) => {
  const { user: current_user } = useAccount();
  const { messages, isTyping, markMessagesAsRead } = useChat();
  const messages_container_ref = useRef<HTMLDivElement>(null);
  const previous_messages_count_ref = useRef<number>(0);
  const [new_message_ids, setNewMessageIds] = useState<Set<string>>(new Set());

  // Track new messages for animation (only truly new ones, not loaded from history)
  useEffect(() => {
    if (
      messages.length > previous_messages_count_ref.current &&
      previous_messages_count_ref.current > 0
    ) {
      // Get IDs of previous messages
      const previous_message_ids_set = new Set(
        messages.slice(0, previous_messages_count_ref.current).map((m) => m.id),
      );

      // New messages are those that weren't there before
      const potentially_new = messages.filter(
        (m) => !previous_message_ids_set.has(m.id),
      );

      if (potentially_new.length > 0) {
        const new_ids = new Set(potentially_new.map((m) => m.id));
        setNewMessageIds(new_ids);
        // Remove "new" flag after 500ms
        setTimeout(() => {
          setNewMessageIds(new Set());
        }, 500);
      }
    }
    previous_messages_count_ref.current = messages.length;
  }, [messages]);

  // Scroll management
  useEffect(() => {
    if (!messages_container_ref.current || is_loading || messages.length === 0)
      return;

    const container = messages_container_ref.current;
    const is_at_bottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    // First load or new message (should_scroll = true)
    if (should_scroll) {
      // Use setTimeout to let DOM update
      setTimeout(() => {
        if (messages_container_ref.current) {
          // Smooth scroll when sending message
          messages_container_ref.current.scrollTo({
            top: messages_container_ref.current.scrollHeight,
            behavior: "smooth",
          });
          onScrollComplete();
        }
      }, 0);
    }
    // New messages at the bottom - scroll only if user was already at bottom
    else if (is_at_bottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, is_loading, should_scroll, onScrollComplete]);

  // Auto-scroll when typing status appears and user is at bottom
  useEffect(() => {
    if (!messages_container_ref.current || is_loading) return;

    const container = messages_container_ref.current;
    const is_at_bottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // If user is at bottom and someone starts typing, scroll to show typing indicator
    if (isTyping && is_at_bottom) {
      setTimeout(() => {
        if (messages_container_ref.current) {
          messages_container_ref.current.scrollTo({
            top: messages_container_ref.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 0);
    }
  }, [isTyping, is_loading]);

  // Mark messages as read when messages are loaded
  useEffect(() => {
    if (messages.length > 0) {
      markMessagesAsRead();
    }
  }, [messages.length, markMessagesAsRead]);

  if (is_loading) {
    return (
      <div className={classes.messages} ref={messages_container_ref}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Загрузка сообщений...
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={classes.messages} ref={messages_container_ref}>
        <div className={classes.messages_empty}>
          <div className={classes.messages_empty_icon}>💬</div>
          <div className={classes.messages_empty_text}>
            Начните разговор с поддержкой
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.messages} ref={messages_container_ref}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          is_outgoing={message.sender_id === current_user?.id}
          sender_avatar={
            message.sender_id === current_user?.id
              ? current_user?.image ?? default_avatar.src
              : default_avatar.src
          }
          is_new={new_message_ids.has(message.id)}
        />
      ))}

      {isTyping && (
        <div className={classes.messages_typing}>
          <div className={classes.messages_typing_indicator}>
            <img
              src={default_avatar.src}
              alt="Typing avatar"
              className={classes.messages_typing_avatar}
            />
            <div className={classes.messages_typing_text}>
              <span className={classes.messages_typing_dots}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

