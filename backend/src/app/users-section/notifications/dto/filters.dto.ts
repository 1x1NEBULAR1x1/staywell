import { BaseFiltersDto, ToBoolean, ToEnum, ToUUID } from 'src/lib/common';
import { Notification, NotificationAction, NotificationType } from '@shared/src/database';
import { NotificationsFilters } from '@shared/src/types/users-section/dto.types';


export class NotificationsFiltersDto extends BaseFiltersDto<Notification> implements NotificationsFilters {
  @ToBoolean({
    required: false,
    description: 'By is read',
    example: false,
  })
  is_read?: boolean;

  @ToUUID({
    required: false,
    description: 'By user id',
  })
  user_id?: string;

  @ToUUID({
    required: false,
    description: 'By object id',
  })
  object_id?: string;

  @ToEnum({
    required: false,
    description: 'By action',
    enum: NotificationAction,
  })
  action?: NotificationAction;

  @ToEnum({
    required: false,
    description: 'By type',
    enum: NotificationType,
  })
  type?: NotificationType;
}