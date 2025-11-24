'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import classes from './NotificationDropdown.module.scss';
import { useNotifications } from '@/hooks/common/useNotifications';
import { Notification, NotificationType, NotificationAction } from '@shared/src/database';
import {
  Bell,
  BellDot,
  Check,
  Calendar,
  Home,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { get, markAsRead } = useNotifications();

  const { data: notifications, isLoading } = get({ ...(showUnreadOnly ? { is_read: false } : {}), take: 1000, skip: 0 });

  const unread_count = notifications?.items?.filter((notification) => !notification.is_read).length || 0;
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsRead.mutateAsync({ id: notification.id });
    }

    // Navigate to object if object_id exists
    if (notification.object_id) {
      const path = getNotificationPath(notification);
      if (path) {
        router.push(path);
        setIsOpen(false);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications?.items) await markAsRead.mutateAsync({ ids: notifications.items.map((notification) => notification.id) });
  };

  const getNotificationPath = (notification: Notification): string | null => {
    if (!notification.object_id) return null;

    switch (notification.type) {
      case NotificationType.BOOKING:
        return `/admin/bookings/${notification.object_id}`;
      case NotificationType.RESERVATION:
        return `/admin/reservations/${notification.object_id}`;
      case NotificationType.MESSAGE:
        return `/admin/messages`;
      default:
        return null;
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case NotificationType.BOOKING:
        return <Calendar className={classes.icon} />;
      case NotificationType.RESERVATION:
        return <Home className={classes.icon} />;
      case NotificationType.MESSAGE:
        return <MessageSquare className={classes.icon} />;
      case NotificationType.ERROR:
        return <XCircle className={classes.icon} />;
      case NotificationType.WARNING:
        return <AlertCircle className={classes.icon} />;
      default:
        return <Bell className={classes.icon} />;
    }
  };

  const getNotificationActionIcon = (action: NotificationAction) => {
    switch (action) {
      case NotificationAction.CONFIRM:
        return <CheckCircle className={classes.action_icon} />;
      case NotificationAction.UPDATE:
        return <Clock className={classes.action_icon} />;
      case NotificationAction.CANCEL:
        return <XCircle className={classes.action_icon} />;
      case NotificationAction.COMPLETE:
        return <CheckCircle className={classes.action_icon} />;
      case NotificationAction.NEW:
        return <AlertCircle className={classes.action_icon} />;
      default:
        return null;
    }
  };

  const getNotificationTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BOOKING:
        return classes.booking;
      case NotificationType.RESERVATION:
        return classes.reservation;
      case NotificationType.MESSAGE:
        return classes.message;
      case NotificationType.ERROR:
        return classes.error;
      case NotificationType.WARNING:
        return classes.warning;
      default:
        return '';
    }
  };

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationDate.toLocaleDateString();
  };

  return (
    <div className={classes.notification_wrapper} ref={dropdownRef}>
      <button
        className={classes.notification_button}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        {unread_count > 0 ? (
          <>
            <BellDot className={classes.bell_icon} />
            <span className={classes.badge}>{unread_count > 99 ? '99+' : unread_count}</span>
          </>
        ) : (
          <Bell className={classes.bell_icon} />
        )}
      </button>

      {isOpen && (
        <div className={classes.dropdown}>
          <div className={classes.dropdown_header}>
            <div className={classes.header_title}>
              <h3>Notifications</h3>
              {unread_count > 0 && (
                <span className={classes.unread_badge}>{unread_count} new</span>
              )}
            </div>
            <div className={classes.header_actions}>
              <button
                className={`${classes.filter_button} ${showUnreadOnly ? classes.active : ''}`}
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              >
                Unread only
              </button>
              {unread_count > 0 && (
                <button
                  className={classes.mark_all_button}
                  onClick={handleMarkAllAsRead}
                  disabled={markAsRead.isPending}
                >
                  <Check className={classes.check_icon} />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className={classes.notifications_list}>
            {isLoading ? (
              <div className={classes.loading}>
                <div className={classes.loader}></div>
                <p>Loading notifications...</p>
              </div>
            ) : notifications?.items?.length === 0 ? (
              <div className={classes.empty_state}>
                <Bell className={classes.empty_icon} />
                <p className={classes.empty_title}>No notifications</p>
                <p className={classes.empty_text}>
                  {showUnreadOnly
                    ? "You're all caught up!"
                    : "You don't have any notifications yet"}
                </p>
              </div>
            ) : (
              notifications?.items?.map((notification) => (
                <div
                  key={notification.id}
                  className={`${classes.notification_item} ${!notification.is_read ? classes.unread : ''
                    } ${getNotificationTypeColor(notification.type)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={classes.notification_icon}>
                    {getNotificationIcon(notification)}
                  </div>
                  <div className={classes.notification_content}>
                    <div className={classes.notification_header}>
                      <span className={classes.notification_type}>
                        {notification.type}
                      </span>
                      {getNotificationActionIcon(notification.action)}
                      <span className={classes.notification_time}>
                        {formatTime(notification.created)}
                      </span>
                    </div>
                    <p className={classes.notification_message}>
                      {notification.message || `${notification.action} notification`}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className={classes.unread_indicator} />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications?.items && notifications?.items?.length > 0 && (
            <div className={classes.dropdown_footer}>
              <button
                className={classes.view_all_button}
                onClick={() => {
                  router.push('/admin/notifications');
                  setIsOpen(false);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

