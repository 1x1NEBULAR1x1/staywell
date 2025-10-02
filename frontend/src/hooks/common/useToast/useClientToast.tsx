'use client';

import { useEffect, useState } from 'react';
import { useToast } from './useToast';
import { ToastType } from '@/components/common/providers/ToastProvider/Toast/Toast';

/**
 * Хук для безопасного использования тостов в клиентских компонентах
 * Предотвращает проблемы с гидрацией в Next.js
 */
export const useClientToast = () => {
  const toast = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Создаем безопасные обертки над методами тоста
  const safeShowToast = (message: string, type: ToastType, duration?: number) => {
    if (isMounted) {
      toast.showToast(message, type, duration);
    }
  };

  const safeSuccess = (message: string, duration?: number) => {
    if (isMounted) {
      toast.success(message, duration);
    }
  };

  const safeError = (message: string, duration?: number) => {
    if (isMounted) {
      toast.error(message, duration);
    }
  };

  const safeWarning = (message: string, duration?: number) => {
    if (isMounted) {
      toast.warning(message, duration);
    }
  };

  return {
    showToast: safeShowToast,
    success: safeSuccess,
    error: safeError,
    warning: safeWarning,
    isMounted
  };
};