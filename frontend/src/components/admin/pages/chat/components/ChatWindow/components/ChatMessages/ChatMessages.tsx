import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "../MessageBubble";
import classes from "./ChatMessages.module.scss";
import { useAccount } from "@/hooks/common/useAccount";
import { useChat } from "@/hooks/admin/chat/useChat";
import { useQPId } from "@/hooks/common/useId";
import default_avatar from "@/../public/common/default-avatar.png";

interface ChatMessagesProps {
  is_loading: boolean;
  has_next_page: boolean;
  is_fetching_next_page: boolean;
  selected_user_avatar: string;
  should_scroll: boolean;
  onLoadMore: () => void;
  onScrollComplete: () => void;
}

export const ChatMessages = ({
  is_loading,
  has_next_page,
  is_fetching_next_page,
  selected_user_avatar,
  should_scroll,
  onLoadMore,
  onScrollComplete,
}: ChatMessagesProps) => {
  const selected_chat_id = useQPId();
  const { user: current_user } = useAccount();
  const { messages, isTyping, markMessagesAsRead } = useChat();
  const messages_container_ref = useRef<HTMLDivElement>(null);
  const previous_scroll_height_ref = useRef<number>(0);
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
        // Check where messages were added - at the top (old from history) or bottom (new)
        // If the first message from potentially_new is at the beginning of the list - it's history
        const first_new_index = messages.findIndex(
          (m) => m.id === potentially_new[0].id,
        );
        const is_loading_history =
          first_new_index < previous_messages_count_ref.current;

        // Animate only if it's not history (new messages at the end)
        if (!is_loading_history) {
          const new_ids = new Set(potentially_new.map((m) => m.id));
          setNewMessageIds(new_ids);
          // Remove "new" flag after 500ms
          setTimeout(() => {
            setNewMessageIds(new Set());
          }, 500);
        }
      }
    }
  }, [messages]);

  // Scroll management
  useEffect(() => {
    if (!messages_container_ref.current || is_loading || messages.length === 0)
      return;

    const container = messages_container_ref.current;
    const is_at_bottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    const messages_count_changed =
      messages.length !== previous_messages_count_ref.current;
    const messages_count_increased =
      messages.length > previous_messages_count_ref.current;

    // First load or chat change (should_scroll = true)
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
    // Loading old messages at the top (infinite scroll)
    else if (
      messages_count_increased &&
      previous_messages_count_ref.current > 0
    ) {
      const new_scroll_height = container.scrollHeight;
      const scroll_height_diff =
        new_scroll_height - previous_scroll_height_ref.current;

      if (scroll_height_diff > 0) {
        // Preserve position: add height difference to current scrollTop
        container.scrollTop = container.scrollTop + scroll_height_diff;
      }
    }
    // New messages at the bottom (polling) - scroll only if user was already at bottom
    else if (messages_count_changed && is_at_bottom) {
      // No animation for incoming messages during polling
      container.scrollTop = container.scrollHeight;
    }

    // Save current state for next update
    previous_messages_count_ref.current = messages.length;
    previous_scroll_height_ref.current = container.scrollHeight;
  }, [messages, is_loading, should_scroll, onScrollComplete]);

  // Auto-scroll when typing status appears and user is at bottom
  useEffect(() => {
    if (!messages_container_ref.current || is_loading) return;

    const container = messages_container_ref.current;
    const is_at_bottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // If user is at bottom and someone starts typing, scroll to show typing indicator
    if (selected_chat_id && isTyping(selected_chat_id) && is_at_bottom) {
      setTimeout(() => {
        if (messages_container_ref.current) {
          messages_container_ref.current.scrollTo({
            top: messages_container_ref.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 0);
    }
  }, [selected_chat_id ? isTyping(selected_chat_id) : false, is_loading]);

  // Mark messages as read when chat is opened and messages are loaded
  useEffect(() => {
    if (selected_chat_id && messages.length > 0) {
      markMessagesAsRead(selected_chat_id);
    }
  }, [selected_chat_id, messages.length, markMessagesAsRead]);

  const handleScroll = () => {
    if (!messages_container_ref.current) return;

    const { scrollTop } = messages_container_ref.current;
    const container = messages_container_ref.current;

    // If scrolled to top - load more messages
    if (scrollTop === 0 && has_next_page && !is_fetching_next_page) {
      // Save current height before loading
      previous_scroll_height_ref.current = container.scrollHeight;
      onLoadMore();
    }

    // Mark messages as read when scrolled to bottom
    const is_at_bottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (is_at_bottom && selected_chat_id && messages.length > 0) {
      markMessagesAsRead(selected_chat_id);
    }
  };

  if (is_loading) {
    return (
      <div className={classes.messages} ref={messages_container_ref}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div
      className={classes.messages}
      ref={messages_container_ref}
      onScroll={handleScroll}
    >
      {has_next_page && (
        <div className={classes.messages_load_more}>
          <button onClick={onLoadMore} disabled={is_fetching_next_page}>
            {is_fetching_next_page ? (
              <span className={classes.messages_load_more_loading}>
                <span className={classes.messages_load_more_spinner} />
                Loading older messages...
              </span>
            ) : (
              "Load previous messages"
            )}
          </button>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          is_outgoing={message.sender_id === current_user?.id}
          sender_avatar={
            message.sender_id === current_user?.id
              ? current_user?.image ?? default_avatar.src
              : selected_user_avatar
          }
          is_new={new_message_ids.has(message.id)}
        />
      ))}

      {selected_chat_id && isTyping(selected_chat_id) && (
        <div className={classes.messages_typing}>
          <div className={classes.messages_typing_indicator}>
            <img
              src={selected_user_avatar}
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
