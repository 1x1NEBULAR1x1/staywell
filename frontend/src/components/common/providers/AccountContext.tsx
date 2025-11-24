'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { query_client } from '@/lib/api';
import { AuthApi } from '@/lib/api/services';
import type { User, UserWithoutPassword } from '@shared/src';
import { isAxiosError } from 'axios';

export interface AccountContextType {
  user: UserWithoutPassword | null;
  is_loading: boolean;
  is_error: boolean;
  is_authenticated: boolean;
  error: unknown;
  refetch: () => void;
  updateUser: (userData: Partial<UserWithoutPassword>) => void;
  clearUser: () => void;
}

/**
 * Контекст для данных пользователя
 */
const AccountContext = createContext<AccountContextType | undefined>(undefined);

/**
 * Хук для использования контекста пользователя
 */
export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount должен использоваться внутри AccountProvider');
  }

  return context;
};

/**
 * Проверка, нужно ли отключить запросы на текущей странице
 */
const shouldDisableQueries = (pathname: string): boolean => {
  return pathname.includes('/auth');
};

/**
 * Провайдер контекста пользователя
 */
export const AccountProvider = ({ children, disable_auth = false }: { children: ReactNode, disable_auth?: boolean }) => {
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
  const api = new AuthApi()
  const pathname = usePathname();
  const should_disable_auth = shouldDisableQueries(pathname) || disable_auth;
  // Query для получения данных пользователя
  const {
    data,
    isLoading: is_loading,
    isFetching: is_fetching,
    isRefetching: is_refetching,
    isPending: is_pending,
    isPaused: is_paused,
    isError: is_error,
    error,
    refetch,
  } = useQuery({
    queryKey: api.query_keys.account(),
    queryFn: async () => {
      try {
        return await api.getProfile();
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 401) return null;
        throw error;
      }
    },
    enabled: !should_disable_auth,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401) return false;
      return failureCount < 3;
    },
    refetchOnMount: !should_disable_auth,
    refetchOnWindowFocus: !should_disable_auth,
    refetchOnReconnect: !should_disable_auth,
  });

  useEffect(() => {
    if (should_disable_auth) return setUser(null);
    setUser(data || null);
  }, [data, should_disable_auth]);

  const is_authenticated = !should_disable_auth && !!data;

  /**
   * Обновление данных пользователя
   */
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated_user = { ...user, ...data };
      setUser(updated_user);
      query_client.setQueryData(api.query_keys.account(), updated_user);
    }
  };

  /**
   * Очистка данных пользователя
   */
  const clearUser = () => {
    setUser(null);
    query_client.removeQueries({ queryKey: api.query_keys.account() });
  };

  const value: AccountContextType = {
    user,
    is_loading: should_disable_auth ? false : (is_loading || is_fetching || is_refetching || is_pending || is_paused),
    is_error: should_disable_auth ? false : is_error,
    is_authenticated,
    error,
    refetch,
    updateUser,
    clearUser,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider; 