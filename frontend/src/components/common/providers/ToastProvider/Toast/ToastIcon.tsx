import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import type { FC } from "react";

interface ToastIconProps {
  type: "success" | "error" | "warning" | "info";
}

export const ToastIcon: FC<ToastIconProps> = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircle size={20} />;
    case "error":
      return <XCircle size={20} />;
    case "warning":
      return <AlertTriangle size={20} />;
    case "info":
      return <Info size={20} />;
    default:
      return null;
  }
};
