import axios, { AxiosRequestConfig } from 'axios';

/**
 * Setup axios for working with API
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookie transmission
});

/**
 * Filter empty values from object
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

// Add interceptor for requests (filtering empty values)
api.interceptors.request.use(
  (config) => {
    // Filter data in body for POST/PUT/PATCH requests, but not for FormData
    if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '') && !(config.data instanceof FormData)) {
      config.data = filterEmptyValues(config.data);
    }

    // Filter request parameters
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

/**
 * Creates config for optional auth request
 * Such requests do not trigger automatic redirect on 401 error
 */
export const createOptionalAuthConfig = (config: AxiosRequestConfig = {}): AxiosRequestConfig => ({
  ...config,
  headers: {
    ...config.headers,
  },
});

// Variable for tracking the token update process
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: Error) => void;
}> = [];

/**
 * Process the queue of requests after the token update
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
 * Redirect to login page
 */
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    const loginPath = `/auth/login`;

    // Clear all user data
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });

    // Redirect to login page only if we are not on a public page
    const isPublicPage = !window.location.pathname.includes('/admin')

    if (!isPublicPage) {
      window.location.href = loginPath;
    }
  }
};

// Add interceptor for responses (error handling)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we received a 401 error
    if (error.response?.status === 401) {

      // Check if this is a public request or an optional request
      const isPublicRequest = originalRequest.url?.includes('/public') ||
        originalRequest.headers?.['X-Optional-Auth'] === 'true';

      // For public or optional requests, just return the error without redirect
      if (isPublicRequest) {
        return Promise.reject(error);
      }

      // Check if the error contains information about the session
      const errorMessage = error.response?.data?.message || '';
      const isSessionError = errorMessage.includes('сессия') ||
        errorMessage.includes('Сессия') ||
        errorMessage.includes('session');

      // If this is a session error or a repeated request, clear the data immediately
      if (isSessionError || originalRequest._retry) {
        redirectToLogin();
        return Promise.reject(error);
      }

      // If this is not a refresh/login/register request, try to update the tokens
      if (!originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/register')) {

        // If the token is already being updated, add the request to the queue
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
          // Try to update the tokens
          const refreshResponse = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {},
            {
              withCredentials: true,
            }
          );

          if (refreshResponse.status === 200) {
            // Process the queue with success
            processQueue(null, 'success');

            // Repeat the original request
            return api(originalRequest);
          }
        } catch (refreshError: unknown) {
          console.error('Failed to update tokens:', refreshError);

          // Process the queue with error
          const error = refreshError instanceof Error ? refreshError : new Error('Token refresh failed');
          processQueue(error, null);

          // Clear the data and redirect
          redirectToLogin();

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Log API errors for debugging
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