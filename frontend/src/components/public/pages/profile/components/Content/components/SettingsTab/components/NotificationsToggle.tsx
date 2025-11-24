"use client";

import { useState } from "react";
import { useAccount } from "@/hooks/common";
import { useUsers } from "@/hooks/admin/queries/users";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/common/useToast";
import classes from "./NotificationsToggle.module.scss";

export const NotificationsToggle = () => {
  const { user, updateUser } = useAccount();
  const updateMutation = useUsers().update(user?.id || "");
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await updateMutation.mutateAsync({
        email_notifications: !user.email_notifications,
      });

      if (response.data) {
        updateUser(response.data);
        toast.success(
          user.email_notifications
            ? "Email уведомления отключены"
            : "Email уведомления включены"
        );
      }
    } catch (error) {
      toast.error("Не удалось обновить настройки уведомлений");
      console.error("Failed to update notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={classes.notifications_toggle}>
      <div className={classes.section_header}>
        <h3>Email уведомления</h3>
        <p>Получайте важные уведомления на email</p>
      </div>

      <div className={classes.toggle_container}>
        <button
          className={`${classes.notification_button} ${user.email_notifications ? classes.active : ''}`}
          onClick={handleToggleNotifications}
          disabled={isLoading}
          type="button"
        >
          {user.email_notifications ? (
            <>
              <Bell size={20} />
              <span>Включены</span>
            </>
          ) : (
            <>
              <BellOff size={20} />
              <span>Отключены</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
