import { api, AxiosResponse, formatQueryPath } from '@/lib/api';
import type { CreateMessage, UpdateMessage, MessagesFilters } from '@shared/src';
import type { Message } from '@shared/src/database';
import type { BaseListResult } from '@shared/src';

/**
 * API для работы с сообщениями
 */
export class MessagesApi {
  endpoint = `${process.env.NEXT_PUBLIC_API_URL}/messages`;

  /**
   * Получить список сообщений
   */
  async get(filters: MessagesFilters): Promise<AxiosResponse<BaseListResult<Message>>> {
    return await api.get<BaseListResult<Message>>(formatQueryPath(this.endpoint, filters));
  }

  /**
   * Получить конкретное сообщение
   */
  async find(id: string): Promise<AxiosResponse<Message>> {
    return await api.get<Message>(`${this.endpoint}/${id}`);
  }

  /**
   * Создать новое сообщение
   */
  async create(data: CreateMessage): Promise<AxiosResponse<Message>> {
    return await api.post<Message>(this.endpoint, data);
  }

  /**
   * Обновить сообщение (например, отметить как прочитанное)
   */
  async update(id: string, data: UpdateMessage): Promise<AxiosResponse<Message>> {
    return await api.put<Message>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Удалить сообщение
   */
  async delete(id: string): Promise<AxiosResponse<void>> {
    return await api.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Отметить все сообщения как прочитанные для конкретного чата
   */
  async markAsRead(chat_partner_id: string): Promise<AxiosResponse<void>> {
    // Эта функция может быть реализована позже на бэкенде
    // Пока можем обновлять сообщения по одному
    return api.post(`${this.endpoint}/mark-as-read`, { chat_partner_id });
  }
}

