import { ColumnConfig, FiltersConfig } from "../../common/AdminPage";
import { NotificationType } from "@shared/src/database";
import { NotificationAction } from "@shared/src/database";
import { Notification } from "@shared/src/database";

export const columns: ColumnConfig<keyof Notification>[] = [
  { label: 'Type', field: 'type' },
  { label: 'Action', field: 'action' },
  { label: 'Message', field: 'message' },
  { label: 'Read', field: 'is_read' },
  { label: 'Created', field: 'created' },
] as const

export const filters_config: FiltersConfig = {
  is_read: {
    type: 'boolean',
    label: 'Read',
  },
  type: {
    type: 'enum',
    options: Object.values(NotificationType),
    label: 'Type',
    placeholder: 'Filter by type...',
  },
  action: {
    type: 'enum',
    options: Object.values(NotificationAction),
    label: 'Action',
    placeholder: 'Filter by action...',
  },
  message: {
    type: 'string',
    label: 'Message',
    placeholder: 'Filter by message...',
  },
} as const
