import { FC, useEffect, useState } from 'react';
import classes from './Toast.module.css';
import { ToastIcon } from './ToastIcon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

/**
 * Toast component
 * @param message - сообщение для отображения
 * @param type - тип уведомления
 * @param duration - длительность уведомления
 * @param onClose - функция для вызова при закрытии уведомления
 */
const Toast: FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    // Запускаем анимацию появления
    const show_timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Запускаем таймер для автоматического закрытия
    const timer = setTimeout(() => {
      setIsVisible(false);

      // Даем время на анимацию скрытия перед удалением из DOM
      setTimeout(() => {
        onClose();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(show_timer);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`${classes.toastContainer} ${classes[type]} ${is_visible ? classes.visible : ''}`}
      role="alert"
    >
      <div className={classes.iconWrapper}>
        <ToastIcon type={type} />
      </div>
      <div className={classes.messageContainer}>
        <p className={classes.message}>{message}</p>
      </div>
      <button
        type="button"
        className={classes.closeButton}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default Toast; 