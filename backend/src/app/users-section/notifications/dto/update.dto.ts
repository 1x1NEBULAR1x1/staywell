import { UpdateNotification } from '@shared/src';
import { ToBoolean } from 'src/lib/common';

export class UpdateNotificationDto implements UpdateNotification {
  @ToBoolean({ required: false, description: 'Is read', example: false })
  is_read?: boolean;

  @ToBoolean({ required: false, description: 'Is excluded', example: false })
  is_excluded?: boolean;
}
