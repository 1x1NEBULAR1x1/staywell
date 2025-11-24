import { api } from '../axios';
import { CrudApi } from './crud.api';



export class NotificationsApi extends CrudApi<'NOTIFICATION'> {
  constructor() {
    super('NOTIFICATION');
  }

  markAsRead = async ({ id, ids }: { id?: string, ids?: string[] }) => api.patch<{ count: number }>(`/notifications/mark-as-read`, { ids: [id, ...(ids || [])].filter(id => id !== undefined) });
}