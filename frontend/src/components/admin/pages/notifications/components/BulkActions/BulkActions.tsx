'use client';

import classes from './BulkActions.module.scss';
import { Check, Trash2, Square, CheckSquare } from 'lucide-react';
import { useBulkActions } from './useBulkActions';

interface BulkActionsProps {
  selectedNotifications: Set<string>;
  setSelectedNotifications: (notifications: Set<string>) => void;
}

export const BulkActions = ({ selectedNotifications, setSelectedNotifications }: BulkActionsProps) => {
  const {
    handleSelectAll,
    handleBulkMarkAsRead,
    allNotifications,
    markAsRead,
  } = useBulkActions({ selectedNotifications, setSelectedNotifications });

  if (selectedNotifications.size === 0) return null;

  const allSelected = allNotifications?.items && selectedNotifications.size === allNotifications.items.length;

  return (
    <div className={classes.bulk_actions}>
      <div className={classes.bulk_actions_content}>
        <div className={classes.selection_info}>
          <button
            className={classes.select_all_button}
            onClick={handleSelectAll}
            title={allSelected ? "Deselect all" : "Select all"}
          >
            {allSelected ? <CheckSquare className={classes.select_icon} /> : <Square className={classes.select_icon} />}
            {selectedNotifications.size} selected
          </button>
        </div>
        <div className={classes.bulk_buttons}>
          <button
            className={`${classes.bulk_button} ${classes.mark_read_button}`}
            onClick={handleBulkMarkAsRead}
            disabled={markAsRead.isPending}
          >
            <Check className={classes.bulk_icon} />
            Mark as read
          </button>
        </div>
      </div>
    </div>
  );
};