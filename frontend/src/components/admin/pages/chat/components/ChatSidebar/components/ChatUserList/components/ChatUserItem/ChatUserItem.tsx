"use client";

import type { UserWithoutPassword } from "@shared/src";
import type { Message } from "@shared/src/database";
import clsx from "clsx";
import Image from "next/image";
import classes from "./ChatUserItem.module.scss";
import default_avatar from "@/../public/common/default-avatar.png";
import { formatMessageTime } from "./utils";
import { useChatUserItem } from "./useChatUserItem";

interface ChatUserItemProps {
  user: UserWithoutPassword;
  is_active: boolean;
  last_message: Message | null;
  unread_count?: number;
  is_online?: boolean;
  is_typing?: boolean;
}

export const ChatUserItem = ({
  user,
  is_active,
  last_message,
  unread_count,
  is_online = false,
  is_typing = false,
}: ChatUserItemProps) => {
  const { handleChatClick } = useChatUserItem();
  const full_name = `${user.first_name} ${user.last_name}`;
  const avatar_url = user.image ?? default_avatar.src;

  const last_message_time = last_message ? formatMessageTime(last_message.created) : "";

  const last_message_preview = is_typing
    ? "typing..."
    : last_message?.message
      ? last_message.message.length > 50
        ? `${last_message.message.substring(0, 50)}...`
        : last_message.message
      : "No messages yet";

  return (
    <div
      className={clsx(classes.user_item, { [classes.user_item_active]: is_active })}
      onClick={() => handleChatClick(user.id)}
    >
      <div className={classes.user_item_avatar_container}>
        <Image
          src={avatar_url}
          alt={full_name}
          width={45}
          height={45}
          className={classes.user_item_avatar}
        />
        {is_online && <div className={classes.user_item_online_indicator} />}
      </div>
      <div className={classes.user_item_content}>
        <div className={classes.user_item_header}>
          <div className={classes.user_item_name}>{full_name}</div>
          {last_message_time && (
            <div className={classes.user_item_time}>{last_message_time}</div>
          )}
        </div>
        <div className={clsx(classes.user_item_message, { [classes.user_item_message_typing]: is_typing })}>{last_message_preview}</div>
      </div>
      {typeof unread_count === 'number' && unread_count > 0 && (
        <div className={classes.user_item_unread_badge}>{unread_count}</div>
      )}
    </div>
  );
};
