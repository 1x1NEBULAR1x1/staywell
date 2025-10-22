'use client';

import classes from './ChatUserList.module.scss';
import { ChatUserItem } from '../ChatUserItem';
import { UserWithoutPassword } from '@shared/src';
import { Message } from '@shared/src/database';

export interface UserWithLastMessage extends UserWithoutPassword {
  last_message?: Message;
  unread_count?: number;
}

interface ChatUserListProps {
  users: UserWithLastMessage[];
  selected_user_id: string | null;
  onSelectUser: (user_id: string) => void;
}

export const ChatUserList = ({
  users,
  selected_user_id,
  onSelectUser,
}: ChatUserListProps) => {
  if (users.length === 0) {
    return (
      <div className={classes.list_empty}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
        <div>No users found</div>
      </div>
    );
  }

  return (
    <div className={classes.list}>
      {users.map((user) => (
        <ChatUserItem
          key={user.id}
          user={user}
          is_active={selected_user_id === user.id}
          last_message={user.last_message}
          unread_count={user.unread_count}
          onClick={() => onSelectUser(user.id)}
        />
      ))}
    </div>
  );
};

