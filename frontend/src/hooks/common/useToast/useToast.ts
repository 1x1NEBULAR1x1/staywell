import { useContext } from "react";
import type { ToastType } from "@/components/common/providers/ToastProvider/Toast/Toast";
import { ToastContext } from "@/components/common/providers/ToastProvider/ToastContext";

// Hook for convenient usage of notification functions
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return {
    /**
     * Show notification
     * @param message - message text
     * @param type - notification type (success, error, warning, info)
     * @param duration - display duration in milliseconds (default 3000)
     */
    showToast: (message: string, type: ToastType, duration?: number) => {
      context.showToast(message, type, duration);
    },

    /**
     * Show success notification
     * @param message - message text
     * @param duration - display duration in milliseconds
     */
    success: (message: string, duration?: number) => {
      context.success(message, duration);
    },

    /**
     * Show error notification
     * @param message - message text
     * @param duration - display duration in milliseconds
     */
    error: (message: string, duration?: number) => {
      context.error(message, duration);
    },

    /**
     * Show warning
     * @param message - message text
     * @param duration - display duration in milliseconds
     */
    warning: (message: string, duration?: number) => {
      context.warning(message, duration);
    },

    /**
     * Show info notification
     * @param message - message text
     * @param duration - display duration in milliseconds
     */
    info: (message: string, duration?: number) => {
      context.info(message, duration);
    },
  };
};
