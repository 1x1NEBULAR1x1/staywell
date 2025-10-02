import { api, formatQueryPath } from '@/lib/api';
import { SessionsFilters, SessionData } from '@shared/src';

/**
 * API для работы с сессиями
 */
export class SessionsApi {
  private static readonly ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/sessions`;

  private static readonly SESSIONS_PATHS = {
    get: (filters: SessionsFilters) => formatQueryPath(this.ENDPOINT, filters),
    deactivate: (session_id: string) => `${this.ENDPOINT}/${session_id}/deactivate`,
    deactivate_all: (user_id?: string) => `${this.ENDPOINT}/deactivate-all/${user_id}`,
    delete: (session_id: string) => `${this.ENDPOINT}/${session_id}`,
  } as const;
  /**
   * Получение всех сессий пользователя
   * @param filters - Фильтры сессий
   * @returns Результат списка сессий пользователя
   */
  static async get(filters: SessionsFilters) {
    return !!filters.user_id ? await api.get<SessionData[]>(this.SESSIONS_PATHS.get(filters)) : { data: undefined }
  }

  /**
   * Деактивация сессии
   * @param session_id - ID сессии
   * @returns Результат деактивации сессии
   */
  static async deactivate_session(session_id: string) {
    return (await api.delete<{ success: boolean; message: string }>(this.SESSIONS_PATHS.deactivate(session_id))).data;
  }

  /**
   * Деактивация всех сессий пользователя
   * @param user_id - ID пользователя
   * @returns Результат деактивации всех сессий пользователя
   */
  static async deactivate_all_sessions(user_id?: string) {
    return !!user_id
      ? (await api.delete<{ deactivated_count: number; message: string }>(this.SESSIONS_PATHS.deactivate_all(user_id))).data
      : { deactivated_count: 0, message: 'error' };
  }

  /**
   * Удаление сессии
   * @param session_id - ID сессии
   * @returns Результат удаления сессии
   */
  static async delete_session(session_id: string) {
    return (await api.delete<{ success: boolean; message: string }>(this.SESSIONS_PATHS.delete(session_id))).data;
  }
}