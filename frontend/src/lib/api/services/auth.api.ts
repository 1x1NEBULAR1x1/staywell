import { api, clearTokensCookies, query_client } from '@/lib/api';
import { AuthResponse } from '@shared/src/types/users-section/extended.types';
import { User, Login, Register } from '@shared/src';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { createOptionalAuthConfig } from '../axios/axios';


const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

/**
 * Paths for auth
 */
const AUTH_PATHS = {
  login: `${ENDPOINT}/login`,
  register: `${ENDPOINT}/register`,
  logout: `${ENDPOINT}/logout`,
  me: `${ENDPOINT}/me`,
  refresh: `${ENDPOINT}/refresh`,
  wsToken: `${ENDPOINT}/ws-token`,
  changePassword: `${ENDPOINT}/change-password`,
} as const;

/**
 * API for auth
 */
export class AuthApi {
  public readonly query_keys = {
    account: () => ['account'],
  } as const;

  async getProfile(): Promise<User> {
    return (await api.get<User>(AUTH_PATHS.me, createOptionalAuthConfig())).data;
  }

  async getWsToken(): Promise<string> {
    return (await api.get<string>(AUTH_PATHS.wsToken, createOptionalAuthConfig())).data;
  }

  onSuccessLogin({ data, refetchUser, router }: { data: AuthResponse, refetchUser: () => void, router: AppRouterInstance }) {
    if (data.user) query_client.setQueryData(this.query_keys.account(), data.user);
    refetchUser();
    const dashboardPath = `/${data.user.role === 'ADMIN' && 'admin'}`;
    router.push(dashboardPath);
  }

  async login(credentials: Login): Promise<AuthResponse> {
    return (await api.post<AuthResponse>(AUTH_PATHS.login, credentials)).data;
  }

  async register(credentials: Register): Promise<AuthResponse> {
    return (await api.post<AuthResponse>(AUTH_PATHS.register, credentials)).data;
  }

  onSuccessLogout({ clearUser, router }: { clearUser: () => void, router: AppRouterInstance }) {
    clearTokensCookies();
    clearUser();
    query_client.clear();
    router.push(`/`);
  }

  async logout() {
    await api.post(AUTH_PATHS.logout)
  }

  async changePassword(data: { current_password: string; new_password: string }): Promise<{ message: string }> {
    return (await api.post<{ message: string }>(AUTH_PATHS.changePassword, data)).data;
  }
}