import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAccount } from '@/components/common/providers/AccountContext';
import { Login, Register } from '@shared/src';
import { AuthApi } from '@/lib/api/services';
import { isAxiosError } from 'axios';

export interface UseAuthReturn {
  login: (data: Login) => void;
  register: (data: Register) => void;
  logout: () => void;
  changePassword: ReturnType<typeof useMutation>;
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
 * Хук для работы с авторизацией
 * @returns Методы и состояния для работы с авторизацией
 */
export const useAuth = (): UseAuthReturn => {
  const authApi = new AuthApi()
  const { clearUser, refetch: refetchUser, error, is_error, is_loading } = useAccount();
  const router = useRouter();
  const [auth_error, setAuthError] = useState<string | null>(null);
  /**
   * Мутация для входа в систему
   */
  const login_mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthError(null); // Очищаем ошибку при успехе
      authApi.onSuccessLogin({ data, refetchUser, router });
    },
    onError: (error: unknown) => {
      console.warn(error)
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : 'Ошибка входа в систему';
      setAuthError(errorMessage);
    }
  });

  /**
   * Мутация для регистрации пользователя
   */
  const register_mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuthError(null); // Очищаем ошибку при успехе
      authApi.onSuccessLogin({ data, refetchUser, router });
    },
    onError: (error: unknown) => {
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : 'Ошибка регистрации';
      setAuthError(errorMessage);
    }
  });

  /**
   * Мутация для выхода из системы
   */
  const logout_mutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setAuthError(null); // Очищаем ошибку при успехе
      authApi.onSuccessLogout({ clearUser, router });
    },
    onError: (error: unknown) => {
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : 'Ошибка выхода из системы';
      setAuthError(errorMessage);
    }
  });

  // Обновляем ошибку при изменении ошибок из AccountContext
  useEffect(() => {
    if (error && is_error) {
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : 'Ошибка аутентификации';
      setAuthError(errorMessage);
    }
  }, [error, is_error]);

  /**
   * Метод для входа в систему
   */
  const login = (data: Login) => {
    setAuthError(null); // Очищаем предыдущие ошибки
    login_mutation.mutate(data);
  };

  /**
   * Метод для регистрации пользователя
   */
  const register = (data: Register) => {
    setAuthError(null); // Очищаем предыдущие ошибки
    register_mutation.mutate(data);
  };

  /**
   * Метод для выхода из системы
   */
  const logout = () => {
    setAuthError(null); // Очищаем предыдущие ошибки
    logout_mutation.mutateAsync();
  };

  /**
   * Мутация для смены пароля
   */
  const change_password_mutation = useMutation({
    mutationFn: authApi.changePassword,
    onError: (error: unknown) => {
      console.warn(error);
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : 'Ошибка смены пароля';
      setAuthError(errorMessage);
    }
  });

  /**
   * Очистка ошибки авторизации
   */
  const clearAuthError = () => {
    setAuthError(null);
  };

  return {
    login,
    register,
    logout,
    changePassword: change_password_mutation,
    clearAuthError,
    is_loading: is_loading || login_mutation.isPending || register_mutation.isPending || logout_mutation.isPending || change_password_mutation.isPending,
    auth_error,
    is_account_loading: is_loading,
    is_login_loading: login_mutation.isPending,
    is_register_loading: register_mutation.isPending,
    is_logout_loading: logout_mutation.isPending,
    is_change_password_loading: change_password_mutation.isPending,
  };
};

export default useAuth;