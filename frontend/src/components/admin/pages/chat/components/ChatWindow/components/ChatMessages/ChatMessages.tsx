import { useEffect, useRef, useState } from 'react';
import classes from './ChatMessages.module.scss';
import { Message } from '@shared/src/database';
import { MessageBubble } from '../MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  is_loading: boolean;
  has_next_page: boolean;
  is_fetching_next_page: boolean;
  current_user_id?: string;
  current_user_avatar?: string;
  selected_user_avatar: string;
  should_scroll: boolean;
  onLoadMore: () => void;
  onScrollComplete: () => void;
}

export const ChatMessages = ({
  messages,
  is_loading,
  has_next_page,
  is_fetching_next_page,
  current_user_id,
  current_user_avatar,
  selected_user_avatar,
  should_scroll,
  onLoadMore,
  onScrollComplete,
}: ChatMessagesProps) => {
  const messages_container_ref = useRef<HTMLDivElement>(null);
  const previous_scroll_height_ref = useRef<number>(0);
  const previous_messages_count_ref = useRef<number>(0);
  const [new_message_ids, setNewMessageIds] = useState<Set<string>>(new Set());

  // Отслеживание новых сообщений для анимации (только реально новые, не загруженные из истории)
  useEffect(() => {
    if (messages.length > previous_messages_count_ref.current && previous_messages_count_ref.current > 0) {
      // Получаем ID предыдущих сообщений
      const previous_message_ids_set = new Set(
        messages.slice(0, previous_messages_count_ref.current).map(m => m.id)
      );

      // Новые сообщения - это те, которых не было раньше
      const potentially_new = messages.filter(m => !previous_message_ids_set.has(m.id));

      if (potentially_new.length > 0) {
        // Проверяем где добавились сообщения - вверху (старые из истории) или внизу (новые)
        // Если первое сообщение из potentially_new находится в начале списка - это история
        const first_new_index = messages.findIndex(m => m.id === potentially_new[0].id);
        const is_loading_history = first_new_index < previous_messages_count_ref.current;

        // Анимируем только если это не история (новые сообщения в конце)
        if (!is_loading_history) {
          const new_ids = new Set(potentially_new.map(m => m.id));
          setNewMessageIds(new_ids);
          // Убираем флаг "новое" через 500мс
          setTimeout(() => {
            setNewMessageIds(new Set());
          }, 500);
        }
      }
    }
  }, [messages]);

  // Управление скроллом
  useEffect(() => {
    if (!messages_container_ref.current || is_loading || messages.length === 0) return;

    const container = messages_container_ref.current;
    const is_at_bottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    const messages_count_changed = messages.length !== previous_messages_count_ref.current;
    const messages_count_increased = messages.length > previous_messages_count_ref.current;

    // Первая загрузка или смена чата (should_scroll = true)
    if (should_scroll) {
      // Используем setTimeout чтобы DOM успел обновиться
      setTimeout(() => {
        if (messages_container_ref.current) {
          // Плавная прокрутка при отправке сообщения
          messages_container_ref.current.scrollTo({
            top: messages_container_ref.current.scrollHeight,
            behavior: 'smooth'
          });
          onScrollComplete();
        }
      }, 0);
    }
    // Загрузка старых сообщений вверху (infinite scroll)
    else if (messages_count_increased && previous_messages_count_ref.current > 0) {
      const new_scroll_height = container.scrollHeight;
      const scroll_height_diff = new_scroll_height - previous_scroll_height_ref.current;

      if (scroll_height_diff > 0) {
        // Сохраняем позицию: добавляем разницу в высоте к текущему scrollTop
        container.scrollTop = container.scrollTop + scroll_height_diff;
      }
    }
    // Новые сообщения внизу (polling) - скроллим только если пользователь уже был внизу
    else if (messages_count_changed && is_at_bottom) {
      // Без анимации для входящих сообщений при polling
      container.scrollTop = container.scrollHeight;
    }

    // Сохраняем текущее состояние для следующего обновления
    previous_messages_count_ref.current = messages.length;
    previous_scroll_height_ref.current = container.scrollHeight;
  }, [messages, is_loading, should_scroll, onScrollComplete]);

  const handleScroll = () => {
    if (!messages_container_ref.current) return;

    const { scrollTop } = messages_container_ref.current;

    // Если проскроллили до верха - загружаем больше сообщений
    if (scrollTop === 0 && has_next_page && !is_fetching_next_page) {
      // Сохраняем текущую высоту перед загрузкой
      previous_scroll_height_ref.current = messages_container_ref.current.scrollHeight;
      onLoadMore();
    }
  };

  if (is_loading) {
    return (
      <div className={classes.messages} ref={messages_container_ref}>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading messages...</div>
      </div>
    );
  }

  return (
    <div className={classes.messages} ref={messages_container_ref} onScroll={handleScroll}>
      {has_next_page && (
        <div className={classes.messages_load_more}>
          <button onClick={onLoadMore} disabled={is_fetching_next_page}>
            {is_fetching_next_page ? (
              <span className={classes.messages_load_more_loading}>
                <span className={classes.messages_load_more_spinner} />
                Loading older messages...
              </span>
            ) : (
              'Load previous messages'
            )}
          </button>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          is_outgoing={message.sender_id === current_user_id}
          sender_avatar={
            message.sender_id === current_user_id
              ? current_user_avatar || '/common/default-avatar.png'
              : selected_user_avatar
          }
          is_new={new_message_ids.has(message.id)}
        />
      ))}
    </div>
  );
};

