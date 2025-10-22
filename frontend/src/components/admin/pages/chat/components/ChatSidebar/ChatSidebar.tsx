'use client';

import { useState, useMemo } from 'react';
import classes from './ChatSidebar.module.scss';
import { useUsers, useMessages } from '@/hooks/admin/queries';
import { useChatStore } from '@/stores/admin/useChatStore';
import { UserWithoutPassword } from '@shared/src';
import { Message } from '@shared/src/database';
import { ChatSidebarHeader, ChatUserList, UserWithLastMessage } from './components';
import { useAccount } from '@/hooks/common/useAccount';

export const ChatSidebar = () => {
  const [search_query, setSearchQuery] = useState('');
  const { selected_chat_id, selectChat, is_collapsed, toggleCollapse } = useChatStore();
  const { user: current_user } = useAccount();

  // Получаем список всех пользователей
  const { data: users_data } = useUsers().get({
    take: 100,
    skip: 0,
  });

  // Получаем последние сообщения с polling (каждые 5 секунд)
  const { data: messages_data } = useMessages().getLastMessages({
    refetchInterval: 5000,
  });

  // Группируем сообщения по пользователям и получаем последнее сообщение с каждым
  const users_with_last_messages = useMemo<UserWithLastMessage[]>(() => {
    if (!users_data?.items || !current_user) return [];

    const messages = messages_data?.items || [];

    return users_data.items.map((user: UserWithoutPassword) => {
      // Находим все сообщения между current_user и этим user
      const user_messages = messages.filter(
        (msg: Message) =>
          (msg.sender_id === user.id && msg.receiver_id === current_user.id) ||
          (msg.sender_id === current_user.id && msg.receiver_id === user.id)
      );

      // Сортируем по дате создания (новые первыми)
      user_messages.sort((a, b) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
      );

      const last_message = user_messages[0];

      // Считаем непрочитанные сообщения от этого пользователя
      const unread_count = user_messages.filter(
        (msg: Message) =>
          msg.sender_id === user.id &&
          msg.receiver_id === current_user.id &&
          !msg.is_read
      ).length;

      return {
        ...user,
        last_message,
        unread_count,
      };
    });
  }, [users_data?.items, messages_data?.items, current_user]);

  // Сортируем пользователей по времени последнего сообщения
  const sorted_users = useMemo(() => {
    return [...users_with_last_messages].sort((a, b) => {
      if (!a.last_message && !b.last_message) return 0;
      if (!a.last_message) return 1;
      if (!b.last_message) return -1;
      return (
        new Date(b.last_message.created).getTime() -
        new Date(a.last_message.created).getTime()
      );
    });
  }, [users_with_last_messages]);

  // Фильтруем пользователей по поисковому запросу
  const filtered_users = useMemo(() => {
    if (!search_query.trim()) return sorted_users;

    const query = search_query.toLowerCase();
    return sorted_users.filter((user) => {
      const full_name = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      return full_name.includes(query) || email.includes(query);
    });
  }, [sorted_users, search_query]);

  const handleSelectUser = (user_id: string) => {
    selectChat(user_id);
  };

  return (
    <div className={classes.sidebar}>
      <ChatSidebarHeader
        search_query={search_query}
        is_collapsed={is_collapsed}
        onSearchChange={setSearchQuery}
        onToggleCollapse={toggleCollapse}
      />

      <ChatUserList
        users={filtered_users}
        selected_user_id={selected_chat_id || null}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};
