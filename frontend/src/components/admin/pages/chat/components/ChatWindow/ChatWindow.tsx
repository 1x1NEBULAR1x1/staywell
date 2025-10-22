'use client';

import { useEffect, useState } from 'react';
import classes from './ChatWindow.module.scss';
import { useMessages } from '@/hooks/admin/queries';
import { useChatStore } from '@/stores/admin/useChatStore';
import { useUsers } from '@/hooks/admin/queries';
import { useAccount } from '@/hooks/common/useAccount';
import { ChatWindowHeader, ChatMessages, ChatInput } from './components';

export const ChatWindow = () => {
  const { selected_chat_id, message_value, setMessageValue, clearDraft } = useChatStore();
  const { user: current_user } = useAccount();
  const [should_scroll, setShouldScroll] = useState(true);

  // Получаем данные выбранного пользователя
  const { data: selected_user } = useUsers().find(selected_chat_id || '');

  // Получаем сообщения с infinite scroll и polling
  const {
    messages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
  } = useMessages().getInfinite(selected_chat_id || '', {
    enabled: !!selected_chat_id,
    refetchInterval: 5000, // Polling каждые 5 секунд для новых сообщений
  });

  // Мутация для создания сообщения с оптимистичным обновлением
  const create_mutation = useMessages().create(selected_chat_id, current_user?.id);

  // Сброс состояния при смене чата
  useEffect(() => {
    setShouldScroll(true);
  }, [selected_chat_id]);

  const handleSendMessage = async () => {
    if (!message_value.trim() || !selected_chat_id || create_mutation.isPending) return;

    const message_text = message_value.trim();

    // Очищаем поле ввода и устанавливаем флаг скролла ДО отправки
    // чтобы оптимистичное сообщение сразу вызвало скролл вниз
    setMessageValue('');
    clearDraft(selected_chat_id);
    setShouldScroll(true);

    try {
      await create_mutation.mutateAsync({
        receiver_id: selected_chat_id,
        message: message_text,
      });
    } catch (error) {
      // При ошибке возвращаем сообщение обратно в поле ввода
      setMessageValue(message_text);
      console.error('Failed to send message:', error);
    }
  };

  const handleScrollComplete = () => {
    setShouldScroll(false);
  };

  if (!selected_chat_id || !selected_user) {
    return null;
  }

  const avatar_url = selected_user.image || '/common/default-avatar.png';

  return (
    <div className={classes.window}>
      <ChatWindowHeader selected_user={selected_user} />

      <ChatMessages
        messages={messages}
        is_loading={isLoading}
        has_next_page={hasNextPage}
        is_fetching_next_page={isFetchingNextPage}
        current_user_id={current_user?.id}
        current_user_avatar={current_user?.image || undefined}
        selected_user_avatar={avatar_url}
        should_scroll={should_scroll}
        onLoadMore={loadMore}
        onScrollComplete={handleScrollComplete}
      />

      <ChatInput
        message_value={message_value}
        is_sending={create_mutation.isPending}
        onMessageChange={setMessageValue}
        onSend={handleSendMessage}
      />
    </div>
  );
};

