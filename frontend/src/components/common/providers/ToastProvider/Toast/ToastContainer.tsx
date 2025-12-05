import { type FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ToastItem } from "../ToastContext";
import Toast from "./Toast";

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastContainer: FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  const [is_mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!is_mounted) return null;

  return (
    <>
      {createPortal(
        toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        )),
        document.body,
      )}
    </>
  );
};
