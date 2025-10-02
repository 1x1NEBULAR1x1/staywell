import { api } from './axios';

/**
 * Функция для обновления токенов на клиентской стороне
 */
export async function refreshTokensClient(): Promise<boolean> {
  try {
    const response = await api.post('/auth/refresh');

    if (response.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Функция для проверки валидности токена
 */
export function isTokenExpired(token: string): boolean {
  try {
    // Декодируем JWT токен (без проверки подписи, только для получения exp)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return true; // Считаем токен истекшим если не можем его проверить
  }
}

/**
 * Функция для получения токенов из cookies
 */
export function getTokensFromCookies(): { access_token?: string; refresh_token?: string } {
  if (typeof document === 'undefined') {
    return {}; // SSR
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    access_token: cookies.access_token,
    refresh_token: cookies.refresh_token,
  };
}

/**
 * Функция для очистки токенов из cookies
 * Обратите внимание: HttpOnly cookies нельзя удалить с клиента, 
 * это должно происходить через сервер
 */
export function clearTokensCookies(): void {
  if (typeof document === 'undefined') return; // SSR
  // Очищаем обычные cookies (не HttpOnly)
  document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
} 