import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { MessagesApi, query_client } from '@/lib/api';
import { useToast } from '@/hooks/common/useToast';
import { CreateMessage, UpdateMessage, MessagesFilters, BaseListResult } from '@shared/src';
import { Message } from '@shared/src/database';
import { useCallback, useMemo } from 'react';

const messages_api = new MessagesApi();

const invalidate_queries = (chat_partner_id?: string) => {
  query_client.invalidateQueries({ queryKey: ['messages'], exact: false });
  if (chat_partner_id) {
    query_client.invalidateQueries({ queryKey: ['messages', 'infinite', { chat_partner_id }] });
  }
};

/**
 * Хук для работы с сообщениями с поддержкой infinite scroll
 */
export const useMessages = () => {
  const toast = useToast();

  /**
   * Бесконечная загрузка сообщений для конкретного чата
   */
  const getInfinite = (
    chat_partner_id: string,
    options?: { enabled?: boolean; refetchInterval?: number }
  ) => {
    const take = 5;

    const query = useInfiniteQuery({
      queryKey: ['messages', 'infinite', { chat_partner_id }],
      queryFn: async ({ pageParam = 0 }) => {
        const result = await messages_api.get({
          chat_partner_id,
          skip: pageParam * take,
          take,
          sort_field: 'created',
          sort_direction: 'desc',
        });
        return result.data;
      },
      getNextPageParam: (lastPage: BaseListResult<Message>, pages) => {
        const hasMore = lastPage.items.length === take;
        return hasMore ? pages.length : undefined;
      },
      initialPageParam: 0,
      enabled: options?.enabled !== false && !!chat_partner_id,
      refetchInterval: options?.refetchInterval || 5000, // Polling каждые 5 секунд
    });

    // Плоский массив всех сообщений
    // Запрос возвращает сообщения с sort_direction: 'desc' (новые сначала)
    // Разворачиваем массив, чтобы в UI старые сообщения были сверху, а новые снизу
    const messages = useMemo(() => {
      const all_messages = query.data?.pages.flatMap(page => page.items) || [];
      return all_messages.reverse();
    }, [query.data]);

    // Функция для загрузки предыдущих сообщений
    const loadMore = useCallback(() => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    }, [query]);

    const totalCount = query.data?.pages[0]?.total || 0;

    return {
      messages,
      totalCount,
      isLoading: query.isLoading,
      isFetchingNextPage: query.isFetchingNextPage,
      hasNextPage: query.hasNextPage,
      loadMore,
      refetch: query.refetch,
      error: query.error,
      isError: query.isError,
    };
  };

  /**
   * Получить список сообщений
   */
  const get = (filters: MessagesFilters) =>
    useQuery({
      queryKey: ['messages', filters],
      queryFn: () => messages_api.get(filters),
      select: (data) => data.data,
    });

  /**
   * Создать новое сообщение с оптимистичным обновлением
   */
  const create = (chat_partner_id?: string, current_user_id?: string) =>
    useMutation({
      mutationFn: (data: CreateMessage) => messages_api.create(data),
      onMutate: async (new_message: CreateMessage) => {
        // Отменяем текущие запросы для этого чата
        await query_client.cancelQueries({
          queryKey: ['messages', 'infinite', { chat_partner_id }]
        });

        // Сохраняем предыдущее состояние для возможного отката
        const previous_data = query_client.getQueryData([
          'messages',
          'infinite',
          { chat_partner_id }
        ]);

        // Создаём временное оптимистичное сообщение
        const optimistic_message: Message = {
          id: `temp-${Date.now()}`,
          sender_id: current_user_id || '',
          receiver_id: new_message.receiver_id,
          message: new_message.message,
          is_read: false,
          booking_id: null,
          created: new Date(),
          updated: new Date(),
        };

        // Обновляем кеш оптимистично
        query_client.setQueryData(
          ['messages', 'infinite', { chat_partner_id }],
          (old: any) => {
            if (!old) return old;

            // Добавляем новое сообщение в первую страницу (последние сообщения)
            return {
              ...old,
              pages: old.pages.map((page: BaseListResult<Message>, index: number) => {
                if (index === 0) {
                  return {
                    ...page,
                    items: [optimistic_message, ...page.items],
                    total: page.total + 1,
                  };
                }
                return page;
              }),
            };
          }
        );

        return { previous_data };
      },
      onSuccess: () => {
        // После успешной отправки обновляем данные с сервера
        invalidate_queries(chat_partner_id);
      },
      onError: (error: any, _new_message, context) => {
        // При ошибке откатываем изменения
        if (context?.previous_data) {
          query_client.setQueryData(
            ['messages', 'infinite', { chat_partner_id }],
            context.previous_data
          );
        }
        toast.error(error?.response?.data?.message || 'Failed to send message');
      },
    });

  /**
   * Обновить сообщение
   */
  const update = (id: string, chat_partner_id?: string) =>
    useMutation({
      mutationFn: (data: UpdateMessage) => messages_api.update(id, data),
      onSuccess: () => {
        invalidate_queries(chat_partner_id);
      },
    });

  /**
   * Удалить сообщение
   */
  const remove = (chat_partner_id?: string) =>
    useMutation({
      mutationFn: (id: string) => messages_api.delete(id),
      onSuccess: () => {
        toast.success('Message deleted successfully');
        invalidate_queries(chat_partner_id);
      },
      onError: () => {
        toast.error('Failed to delete message');
      },
    });

  /**
   * Отметить сообщения как прочитанные
   */
  const markAsRead = (chat_partner_id: string) =>
    useMutation({
      mutationFn: () => messages_api.markAsRead(chat_partner_id),
      onSuccess: () => {
        invalidate_queries(chat_partner_id);
      },
    });

  /**
   * Получить последние сообщения с каждым пользователем с polling
   */
  const getLastMessages = (options?: { refetchInterval?: number }) =>
    useQuery({
      queryKey: ['messages', 'last'],
      queryFn: async () => {
        const result = await messages_api.get({
          take: 100,
          skip: 0,
          sort_field: 'created',
          sort_direction: 'desc',
        });
        return result.data;
      },
      refetchInterval: options?.refetchInterval || 5000, // Polling каждые 5 секунд
      select: (data) => data,
    });

  return {
    get,
    getInfinite,
    getLastMessages,
    create,
    update,
    remove,
    markAsRead,
  };
};

