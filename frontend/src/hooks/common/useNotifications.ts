import { useQuery, useMutation } from '@tanstack/react-query';
import { query_client } from '@/lib/api/axios/query-client';
import { NotificationsApi } from '@/lib/api/services/notifications.api';
import { useModel } from '../admin/queries';
import { NotificationsFilters } from '@shared/src/types/users-section/dto.types';
import { QUERY_KEYS } from '../admin/queries/useModel/lib';

// Hook to get all notifications
export const useNotifications = () => {
  const api = new NotificationsApi()
  const actions = useModel('NOTIFICATION')

  const markAsRead = useMutation({
    mutationFn: ({ id, ids }: { id?: string, ids?: string[] }) => api.markAsRead({ id, ids }),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ['notifications'], exact: false })
    },
  })

  const get = (filters: NotificationsFilters) => useQuery({
    queryKey: QUERY_KEYS('NOTIFICATION').get(filters),
    queryFn: () => api.get(filters),
    select: (data) => data.data,
    refetchInterval: 30000, // 30 seconds
  })

  return {
    ...actions,
    get,
    markAsRead,
  }
};
