import type { AuthResponse, Login, Register } from "@shared/src";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "@/components/common/providers/AccountContext";
import { AuthApi } from "@/lib/api/services";

export interface UseAuthReturn {
  login: (data: Login) => void;
  register: (data: Register) => void;
  logout: () => void;
  register_mutation: UseMutationResult<AuthResponse, unknown, Register>;
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => void;
  clearAuthError: () => void;
  is_loading: boolean;
  is_account_loading: boolean;
  is_login_loading: boolean;
  is_register_loading: boolean;
  is_logout_loading: boolean;
  is_change_password_loading: boolean;
  auth_error: string | null;
}
/**
 * Hook for working with authentication
 * @returns Methods and states for authentication
 */
export const useAuth = (): UseAuthReturn => {
  const authApi = new AuthApi();
  const {
    clearUser,
    refetch: refetchUser,
    error,
    is_error,
    is_loading,
  } = useAccount();
  const router = useRouter();
  const [auth_error, setAuthError] = useState<string | null>(null);
  /**
   * Mutation for login
   */
  const login_mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthError(null); // Clear error on success
      authApi.onSuccessLogin({ data, refetchUser, router });
    },
    onError: (error: unknown) => {
      console.warn(error);
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Login error";
      setAuthError(errorMessage);
    },
  });

  /**
   * Mutation for user registration
   */
  const register_mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuthError(null); // Clear error on success
      authApi.onSuccessLogin({ data, refetchUser, router });
    },
    onError: (error: unknown) => {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Registration error";
      setAuthError(errorMessage);
    },
  });

  /**
   * Mutation for logout
   */
  const logout_mutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setAuthError(null); // Clear error on success
      authApi.onSuccessLogout({ clearUser, router });
    },
    onError: (error: unknown) => {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Logout error";
      setAuthError(errorMessage);
    },
  });

  // Update error when AccountContext errors change
  useEffect(() => {
    if (error && is_error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Authentication error";
      setAuthError(errorMessage);
    }
  }, [error, is_error]);

  /**
   * Method for login
   */
  const login = (data: Login) => {
    setAuthError(null); // Clear previous errors
    login_mutation.mutate(data);
  };

  /**
   * Method for user registration
   */
  const register = (data: Register) => {
    setAuthError(null); // Clear previous errors
    register_mutation.mutate(data);
  };

  /**
   * Method for logout
   */
  const logout = () => {
    setAuthError(null); // Clear previous errors
    logout_mutation.mutateAsync();
  };

  /**
   * Mutation for password change
   */
  const change_password_mutation = useMutation({
    mutationFn: authApi.changePassword,
    onError: (error: unknown) => {
      console.warn(error);
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.message
        : "Password change error";
      setAuthError(errorMessage);
    },
  });

  /**
   * Clear authentication error
   */
  const clearAuthError = () => {
    setAuthError(null);
  };

  return {
    login,
    register,
    logout,
    register_mutation,
    changePassword: (data: {
      current_password: string;
      new_password: string;
    }) => change_password_mutation.mutate(data),
    clearAuthError,
    is_loading:
      is_loading ||
      login_mutation.isPending ||
      register_mutation.isPending ||
      logout_mutation.isPending ||
      change_password_mutation.isPending,
    auth_error,
    is_account_loading: is_loading,
    is_login_loading: login_mutation.isPending,
    is_register_loading: register_mutation.isPending,
    is_logout_loading: logout_mutation.isPending,
    is_change_password_loading: change_password_mutation.isPending,
  };
};

export default useAuth;
