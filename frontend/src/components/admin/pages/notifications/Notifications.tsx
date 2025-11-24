'use client'

import { useState } from 'react';
import { Notification } from '@shared/src/database';

import { NotificationCard, NotificationCardShimmer, BulkActions } from './components';
import { ListPage } from '@/components/admin/common/AdminPage';
import { columns, filters_config } from './config';

export const Notifications = () => {
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const handleSelectNotification = (notification: Notification) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notification.id)) {
      newSelected.delete(notification.id);
    } else {
      newSelected.add(notification.id);
    }
    setSelectedNotifications(newSelected);
  };

  return (
    <div>
      <BulkActions selectedNotifications={selectedNotifications} setSelectedNotifications={setSelectedNotifications} />
      <ListPage
        model="NOTIFICATION"
        filters_config={filters_config}
        render_item={(notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            isSelected={selectedNotifications.has(notification.id)}
            onSelect={handleSelectNotification}
          />
        )}
        shimmer_item={(key) => <NotificationCardShimmer key={key} />}
        columns={columns}
        sort_by_list={Object.keys({
          id: '',
          type: '',
          action: '',
          message: '',
          is_read: false,
          is_excluded: false,
          created: new Date(),
          updated: new Date()
        })}
      />
    </div>
  );
}
