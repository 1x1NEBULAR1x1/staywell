import { CreateNotification } from '@shared/src';
import { NotificationAction, NotificationType } from '@shared/src/database';
import { ToString, ToEnum, ToUUID } from 'src/lib/common';

export class CreateNotificationDto implements CreateNotification {
  @ToEnum({
    required: true,
    enum: NotificationType,
    enumName: 'NotificationType',
  })
  type!: NotificationType;

  @ToEnum({
    required: true,
    enum: NotificationAction,
    enumName: 'NotificationAction',
  })
  action!: NotificationAction;

  @ToString({ required: false, min: 1, max: 4096 })
  message?: string;

  @ToUUID({
    required: false,
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id?: string;

  @ToUUID({
    required: false,
    description: 'Related object ID (booking, reservation, event, etc.)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  object_id?: string;
}
