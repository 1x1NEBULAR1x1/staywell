import { useContext } from 'react';
import { ToastContext } from '@/components/common/providers/ToastProvider/ToastContext';
import { ToastType } from '@/components/common/providers/ToastProvider/Toast/Toast';

// Хук для удобного использования функций уведомлений
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast должен использоваться внутри ToastProvider');
  }

  return {
    /**
     * Показать уведомление
     * @param message - текст сообщения
     * @param type - тип уведомления (success, error, warning, info)
     * @param duration - длительность показа в миллисекундах (по умолчанию 3000)
     */
    showToast: (message: string, type: ToastType, duration?: number) => {
      context.showToast(message, type, duration);
    },

    /**
     * Показать уведомление об успехе
     * @param message - текст сообщения
     * @param duration - длительность показа в миллисекундах
     */
    success: (message: string, duration?: number) => {
      context.success(message, duration);
    },

    /**
     * Показать уведомление об ошибке
     * @param message - текст сообщения
     * @param duration - длительность показа в миллисекундах
     */
    error: (message: string, duration?: number) => {
      context.error(message, duration);
    },

    /**
     * Показать предупреждение
     * @param message - текст сообщения
     * @param duration - длительность показа в миллисекундах
     */
    warning: (message: string, duration?: number) => {
      context.warning(message, duration);
    },

    /**
     * Показать информационное уведомление
     * @param message - текст сообщения
     * @param duration - длительность показа в миллисекундах
     */
    info: (message: string, duration?: number) => {
      context.info(message, duration);
    }
  };
};