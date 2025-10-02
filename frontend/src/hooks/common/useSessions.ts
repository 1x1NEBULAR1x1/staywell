import { useQuery, useMutation } from '@tanstack/react-query';
import { SessionsApi } from '@/lib/api/services';
import { query_client } from '@/lib/api';
import { QUERY_KEYS } from '@/hooks/admin/queries/useModel/lib/query-keys';
import { useToast } from './useToast';
import { SessionsFilters } from '@shared/src';

const invalidate_queries = (filters: Partial<SessionsFilters>) => {
  query_client.invalidateQueries({ queryKey: QUERY_KEYS('SESSION').get(filters), exact: false });
}
/**
 * Хук для работы с сессиями пользователя
 */
export const useSessions = (filters: SessionsFilters) => {
  const toast = useToast()
  /**
   * Получение активных сессий пользователя
   */
  const useGet = (filters: SessionsFilters) => useQuery({
    queryKey: QUERY_KEYS('SESSION').get(filters),
    queryFn: () => SessionsApi.get(filters),
    enabled: !!filters.user_id,
    select: data => data.data
  });

  /**
   * Деактивация конкретной сессии
   */
  const useDeactivate = () => useMutation({
    mutationFn: SessionsApi.deactivate_session,
    onSuccess: () => {
      toast.success('Session has been deactivated successfully')
      invalidate_queries(filters)
    },
    onError: (error) => toast.error(error.message)
  });

  /**
   * Деактивация всех остальных сессий (кроме текущей)
   */
  const useDeactivateAll = () => useMutation({
    mutationFn: () => SessionsApi.deactivate_all_sessions(filters.user_id),
    onSuccess: () => {
      toast.success('All sessions have been deactivated successfully')
      invalidate_queries(filters)
    },
    onError: (error) => toast.error(error.message)
  });

  const useDelete = () => useMutation({
    mutationFn: (session_id: string) => SessionsApi.delete_session(session_id),
    onSuccess: () => {
      toast.success('Session has been deleted successfully')
      invalidate_queries(filters)
    },
    onError: (error) => toast.error(error.message)
  });

  return {
    useGet,
    useDeactivate,
    useDeactivateAll,
    useDelete
  };
};