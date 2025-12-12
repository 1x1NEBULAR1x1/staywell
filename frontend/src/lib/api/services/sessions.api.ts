import type { SessionData, SessionsFilters } from "@shared/src";
import { api, formatQueryPath } from "@/lib/api";

/**
 * API for interacting with sessions
 */
export class SessionsApi {
  private readonly ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/sessions`;

  private readonly SESSIONS_PATHS = {
    get: (filters: SessionsFilters) => formatQueryPath(this.ENDPOINT, filters),
    deactivate: (session_id: string) =>
      `${this.ENDPOINT}/${session_id}/deactivate`,
    deactivate_all: (user_id?: string) =>
      `${this.ENDPOINT}/deactivate-all/${user_id}`,
    delete: (session_id: string) => `${this.ENDPOINT}/${session_id}`,
  } as const;
  /**
   * Get all user sessions
   * @param filters - Sessions filters
   * @returns Result of getting all user sessions
   */
  async get(filters: SessionsFilters) {
    return filters.user_id
      ? await api.get<SessionData[]>(this.SESSIONS_PATHS.get(filters))
      : { data: undefined };
  }

  /**
   * Deactivate session
   * @param session_id - Session ID
   * @returns Result of deactivating session
   */
  async deactivate_session(session_id: string) {
    return (
      await api.delete<{ success: boolean; message: string }>(
        this.SESSIONS_PATHS.deactivate(session_id),
      )
    ).data;
  }

  /**
   * Deactivate all user sessions
   * @param user_id - User ID
   * @returns Result of deactivating all user sessions
   */
  async deactivate_all_sessions(user_id?: string) {
    return user_id
      ? (
          await api.delete<{ deactivated_count: number; message: string }>(
            this.SESSIONS_PATHS.deactivate_all(user_id),
          )
        ).data
      : { deactivated_count: 0, message: "error" };
  }

  /**
   * Delete session
   * @param session_id - Session ID
   * @returns Result of deleting session
   */
  async delete_session(session_id: string) {
    return (
      await api.delete<{ success: boolean; message: string }>(
        this.SESSIONS_PATHS.delete(session_id),
      )
    ).data;
  }
}
