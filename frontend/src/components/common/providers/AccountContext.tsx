'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { query_client } from '@/lib/api';
import { authApi } from '@/lib/api/services';
import type { User } from '@shared/src';
import { isAxiosError } from 'axios';

export interface AccountContextType {
  user: User | null;
  is_loading: boolean;
  is_error: boolean;
  is_authenticated: boolean;
  error: unknown;
  refetch: () => void;
  updateUser: (userData: Partial<User>) => void;
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

interface AccountProviderProps {
  children: ReactNode;
}

/**
 * Проверка, нужно ли отключить запросы на текущей странице
 */
const shouldDisableQueries = (pathname: string): boolean => {
  return pathname.includes('/auth');
};

/**
 * Провайдер контекста пользователя
 */
export const AccountProvider = ({ children }: AccountProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const shouldDisableAuth = shouldDisableQueries(pathname);
  // Query для получения данных пользователя
  const {
    data: userData,
    isLoading: is_loading,
    isFetching: is_fetching,
    isRefetching: is_refetching,
    isPending: is_pending,
    isPaused: is_paused,
    isError: is_error,
    error,
    refetch,
  } = useQuery({
    queryKey: authApi.query_keys.account(),
    queryFn: async () => {
      try {
        return await authApi.getProfile();
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 401) return null;
        throw error;
      }
    },
    enabled: !shouldDisableAuth,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401) return false;
      return failureCount < 3;
    },
    refetchOnMount: !shouldDisableAuth,
    refetchOnWindowFocus: !shouldDisableAuth,
    refetchOnReconnect: !shouldDisableAuth,
  });

  useEffect(() => {
    if (shouldDisableAuth) return setUser(null);
    setUser(userData || null);
  }, [userData, shouldDisableAuth]);

  const is_authenticated = !shouldDisableAuth && !!userData;

  /**
   * Обновление данных пользователя
   */
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      query_client.setQueryData(authApi.query_keys.account(), updatedUser);
    }
  };

  /**
   * Очистка данных пользователя
   */
  const clearUser = () => {
    setUser(null);
    query_client.setQueryData(authApi.query_keys.account(), null);
    query_client.removeQueries({ queryKey: authApi.query_keys.account() });
  };

  const value: AccountContextType = {
    user,
    is_loading: shouldDisableAuth ? false : (is_loading || is_fetching || is_refetching || is_pending || is_paused),
    is_error: shouldDisableAuth ? false : is_error,
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