"use client";

import type { User, UserWithoutPassword } from "@shared/src";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { query_client } from "@/lib/api";
import { UsersApi } from "@/lib/api/services";

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
 * Context for user data
 */
const AccountContext = createContext<AccountContextType | undefined>(undefined);

/**
 * Hook for using user context
 */
export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used inside AccountProvider");
  }

  return context;
};

/**
 * Check if queries should be disabled on current page
 */
const shouldDisableQueries = (pathname: string): boolean => {
  return pathname.includes("/auth");
};

/**
 * User context provider
 */
export const AccountProvider = ({
  children,
  initial_data,
  disable_auth = false,
}: {
  children: ReactNode;
  initial_data: UserWithoutPassword | null;
  disable_auth?: boolean;
}) => {
  const [user, setUser] = useState<UserWithoutPassword | null>(initial_data);
  const api = new UsersApi();
  const pathname = usePathname();
  const should_disable_auth = shouldDisableQueries(pathname) || disable_auth;

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["account"],
    queryFn: () => api.me(),
    enabled: !should_disable_auth,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401) return false;
      return failureCount < 3;
    },
    select: (response) => response.data,
    refetchOnMount: !(should_disable_auth || initial_data),
    refetchOnWindowFocus: !(should_disable_auth || initial_data),
    refetchOnReconnect: !(should_disable_auth || initial_data),
  });

  useEffect(() => {
    if (should_disable_auth) return setUser(null);
    setUser(data || null);
  }, [data, should_disable_auth]);

  const is_authenticated = !should_disable_auth && !!data;

  /**
   * Update user data
   */
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated_user = { ...user, ...data };
      setUser(updated_user);
      query_client.setQueryData(["account"], updated_user);
    }
  };

  /**
   * Clear user data
   */
  const clearUser = () => {
    setUser(null);
    query_client.removeQueries({ queryKey: ["account"] });
  };

  const value: AccountContextType = {
    user,
    is_loading: should_disable_auth ? false : isLoading && !isRefetching,
    is_error: should_disable_auth ? false : isError,
    is_authenticated,
    error,
    refetch,
    updateUser,
    clearUser,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export default AccountProvider;
