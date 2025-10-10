import axios, { AxiosRequestConfig } from 'axios';

/**
 * Настройка axios для работы с API
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Включаем передачу куки
});

/**
 * Фильтрация пустых значений из объекта
 */
const filterEmptyValues = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => filterEmptyValues(item));
  }

  if (data && typeof data === 'object' && !(data instanceof File)) {
    const filtered: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        filtered[key] = filterEmptyValues(value);
      }
    });
    return filtered;
  }

  return data;
};

// Добавляем interceptor для запросов (фильтрация пустых значений)
api.interceptors.request.use(
  (config) => {
    // Фильтруем данные в body для POST/PUT/PATCH запросов, но не для FormData
    if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '') && !(config.data instanceof FormData)) {
      config.data = filterEmptyValues(config.data);
    }

    // Фильтруем параметры запроса
    if (config.params) {
      config.params = filterEmptyValues(config.params);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createFormData = (data: object): [FormData, AxiosRequestConfig] => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      formData.append(key, value instanceof File ? value : String(value));
    }
  });
  return [formData, { headers: { 'Content-Type': 'multipart/form-data' } }];
};

// Переменная для отслеживания процесса обновления токена
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: Error) => void;
}> = [];

/**
 * Обработка очереди запросов после обновления токена
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Редирект на страницу логина с учетом локали
 */
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    const loginPath = `/auth/login`;

    // Очищаем все данные пользователя
    localStorage.clear();
    sessionStorage.clear();

    // Очищаем куки
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    // Перенаправляем на страницу входа
    window.location.href = loginPath;
  }
};

// Добавляем interceptor для ответов (обработка ошибок авторизации)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если получили 401 ошибку
    if (error.response?.status === 401) {

      // Проверяем, содержит ли ошибка информацию о сессии
      const errorMessage = error.response?.data?.message || '';
      const isSessionError = errorMessage.includes('сессия') ||
        errorMessage.includes('Сессия') ||
        errorMessage.includes('session');

      // Если это ошибка сессии или уже был повтор запроса - сразу очищаем данные
      if (isSessionError || originalRequest._retry) {
        redirectToLogin();
        return Promise.reject(error);
      }

      // Если это не запрос на refresh/login/register, пытаемся обновить токены
      if (!originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/register')) {

        // Если токен уже обновляется, добавляем запрос в очередь
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Пытаемся обновить токены
          const refreshResponse = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {},
            {
              withCredentials: true,
            }
          );

          if (refreshResponse.status === 200) {
            // Обрабатываем очередь с успехом
            processQueue(null, 'success');

            // Повторяем оригинальный запрос
            return api(originalRequest);
          }
        } catch (refreshError: unknown) {
          console.error('Не удалось обновить токены:', refreshError);

          // Обрабатываем очередь с ошибкой
          const error = refreshError instanceof Error ? refreshError : new Error('Token refresh failed');
          processQueue(error, null);

          // Очищаем данные и перенаправляем
          redirectToLogin();

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Логируем ошибки API для отладки
    if (error.response?.status !== 401) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
    }

    return Promise.reject(error);
  }
);

export { api };