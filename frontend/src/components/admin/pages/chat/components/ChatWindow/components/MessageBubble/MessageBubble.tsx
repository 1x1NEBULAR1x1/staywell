import type { Message } from "@shared/src/database";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/admin/chat/useChat";
import classes from "./MessageBubble.module.scss";

interface MessageBubbleProps {
  message: Message;
  is_outgoing: boolean;
  sender_avatar: string;
  is_new?: boolean;
  onEdit?: (messageId: string, newText: string) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble = ({
  message,
  is_outgoing,
  sender_avatar,
  is_new = false,
  onEdit,
  onDelete,
}: MessageBubbleProps) => {
  const [show_animation, setShowAnimation] = useState(is_new);
  const [show_menu, setShowMenu] = useState(false);
  const [is_editing, setIsEditing] = useState(false);
  const [edit_text, setEditText] = useState(message.message);
  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const { editMessage, deleteMessage } = useChat();

  useEffect(() => {
    if (is_new) {
      // Remove animation class after completion
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [is_new]);

  // Handle clicking outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (show_menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show_menu]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (is_editing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [is_editing]);

  const formatted_time = new Date(message.created).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = async () => {
    if (edit_text.trim() && edit_text !== message.message) {
      try {
        await editMessage(message.id, edit_text.trim());
        onEdit?.(message.id, edit_text.trim());
      } catch (error) {
        console.error("Failed to edit message:", error);
      }
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(message.message);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(message.id);
      onDelete?.(message.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
    setShowMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={clsx(classes.message, {
        [classes.message_outgoing]: is_outgoing,
        [classes.message_incoming]: !is_outgoing,
        [classes.message_animate]: show_animation,
      })}
    >
      <Image
        src={sender_avatar}
        alt="Avatar"
        width={40}
        height={40}
        className={classes.message_avatar}
      />
      <div className={classes.message_content}>
        <div className={classes.message_bubble}>
          {is_editing ? (
            <div className={classes.edit_container}>
              <textarea
                ref={editInputRef}
                value={edit_text}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                className={classes.edit_input}
                maxLength={2000}
                rows={Math.min(edit_text.split("\n").length, 5)}
              />
              <div className={classes.edit_actions}>
                <button
                  onClick={handleSaveEdit}
                  className={classes.save_button}
                  disabled={!edit_text.trim() || edit_text === message.message}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={classes.cancel_button}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={classes.message_text}>
                {message.message}
                {message.edited && (
                  <span className={classes.edited_mark}>(edited)</span>
                )}
              </div>
              {is_outgoing && (
                <div
                  className={classes.message_menu_trigger}
                  onClick={() => setShowMenu(!show_menu)}
                >
                  ⋮
                </div>
              )}
            </>
          )}
        </div>
        <div className={classes.message_time}>{formatted_time}</div>

        {show_menu && is_outgoing && (
          <div ref={menuRef} className={classes.message_menu}>
            <button onClick={handleEdit} className={classes.menu_item}>
              ✏️ Edit
            </button>
            <button onClick={handleDelete} className={classes.menu_item}>
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
