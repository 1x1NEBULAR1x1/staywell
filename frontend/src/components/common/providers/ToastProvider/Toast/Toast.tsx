import { X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import classes from "./Toast.module.scss";
import { ToastIcon } from "./ToastIcon";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

/**
 * Toast component
 * @param message - message to display
 * @param type - notification type
 * @param duration - notification duration
 * @param onClose - function to call when closing notification
 */
const Toast: FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [is_visible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start appear animation
    const show_timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Start timer for auto-close
    const timer = setTimeout(() => {
      setIsVisible(false);

      // Give time for hide animation before removing from DOM
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
      className={`${classes.toastContainer} ${classes[type]} ${is_visible ? classes.visible : ""}`}
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
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
