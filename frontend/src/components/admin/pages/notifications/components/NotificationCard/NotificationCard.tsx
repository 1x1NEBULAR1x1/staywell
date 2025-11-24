import classes from './NotificationCard.module.scss';
import { Notification, NotificationType, NotificationAction } from '@shared/src/database';
import { Shimmer } from '@/components/styles';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/common/useNotifications';
import {
  Calendar,
  Home,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Bell,
  Check,
  Trash2
} from 'lucide-react';

type NotificationCardProps = {
  notification: Notification;
  isSelected?: boolean;
  onSelect?: (notification: Notification) => void;
}

export const NotificationCard = ({ notification, isSelected = false, onSelect }: NotificationCardProps) => {
  const router = useRouter();
  const { markAsRead, remove } = useNotifications();

  const handleNotificationClick = async () => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsRead.mutateAsync({ id: notification.id });
    }

    // Navigate to object if object_id exists
    if (notification.object_id) {
      const path = getNotificationPath(notification);
      if (path) {
        router.push(path);
      }
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.is_read) {
      await markAsRead.mutateAsync({ id: notification.id });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await remove(notification.id).mutateAsync();
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(notification);
  };

  return (
    <tr
      className={`${classes.notification_row} ${!notification.is_read ? classes.unread : ''} ${classes.clickable}`}
      onClick={handleNotificationClick}
    >
      <td>
        <div className={classes.notification_type_container} onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className={classes.checkbox}
          />
          {getNotificationIcon(notification)}
          <span className={classes.notification_type}>{notification.type}</span>
        </div>
      </td>
      <td>
        <div className={classes.notification_action}>
          {getNotificationActionIcon(notification.action)}
          <span>{notification.action}</span>
        </div>
      </td>
      <td className={classes.notification_message}>
        {notification.message || `${notification.action} notification`}
      </td>
      <td>
        <span className={`${classes.notification_read_status} ${notification.is_read ? classes.read : classes.unread}`}>
          {notification.is_read ? 'Read' : 'Unread'}
        </span>
      </td>
      <td className={classes.notification_created}>
        {new Date(notification.created).toLocaleDateString()}
        <div className={classes.actions}>
          {!notification.is_read && (
            <button
              className={classes.action_button}
              onClick={handleMarkAsRead}
              disabled={markAsRead.isPending}
              title="Mark as read"
            >
              <Check size={16} />
            </button>
          )}
          <button
            className={`${classes.action_button} ${classes.delete_button}`}
            onClick={handleDelete}
            disabled={remove(notification.id).isPending}
            title="Delete notification"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
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

export const NotificationCardShimmer = () => (
  <tr className={classes.notification_row}>
    <td>
      <div className={classes.notification_type_container}>
        <Shimmer style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
        <Shimmer style={{ width: '80px', height: '18px', borderRadius: '4px', marginLeft: '8px' }} />
      </div>
    </td>
    <td>
      <div className={classes.notification_action}>
        <Shimmer style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
        <Shimmer style={{ width: '60px', height: '18px', borderRadius: '4px', marginLeft: '8px' }} />
      </div>
    </td>
    <td className={classes.notification_message}>
      <Shimmer style={{ width: '200px', height: '18px', borderRadius: '4px' }} />
    </td>
    <td>
      <Shimmer style={{ width: '60px', height: '24px', borderRadius: '4px' }} />
    </td>
    <td className={classes.notification_created}>
      <Shimmer style={{ width: '100px', height: '18px', borderRadius: '4px' }} />
    </td>
  </tr>
);
