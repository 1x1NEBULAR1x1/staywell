'use client';

import Image from 'next/image';
import classes from './ChatUserItem.module.scss';
import clsx from 'clsx';
import { UserWithoutPassword } from '@shared/src';
import { Message } from '@shared/src/database';

interface ChatUserItemProps {
  user: UserWithoutPassword;
  is_active: boolean;
  last_message?: Message;
  unread_count?: number;
  onClick: () => void;
}

export const ChatUserItem = ({
  user,
  is_active,
  last_message,
  unread_count,
  onClick,
}: ChatUserItemProps) => {
  const full_name = `${user.first_name} ${user.last_name}`;
  const avatar_url = user.image || '/common/default-avatar.png';

  // Форматируем время последнего сообщения
  const formatMessageTime = (date: Date | string) => {
    const message_date = new Date(date);
    const now = new Date();
    const diff = now.getTime() - message_date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;

    return message_date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const last_message_time = last_message
    ? formatMessageTime(last_message.created)
    : '';

  const last_message_preview = last_message?.message
    ? last_message.message.length > 50
      ? `${last_message.message.substring(0, 50)}...`
      : last_message.message
    : 'No messages yet';

  return (
    <div
      className={clsx(classes.user_item, {
        [classes.user_item_active]: is_active,
      })}
      onClick={onClick}
    >
      <Image
        src={avatar_url}
        alt={full_name}
        width={45}
        height={45}
        className={classes.user_item_avatar}
      />
      <div className={classes.user_item_content}>
        <div className={classes.user_item_header}>
          <div className={classes.user_item_name}>{full_name}</div>
          {last_message_time && (
            <div className={classes.user_item_time}>{last_message_time}</div>
          )}
        </div>
        <div className={classes.user_item_message}>{last_message_preview}</div>
      </div>
      {unread_count && unread_count > 0 && (
        <div className={classes.user_item_unread_badge}>{unread_count}</div>
      )}
    </div>
  );
};

