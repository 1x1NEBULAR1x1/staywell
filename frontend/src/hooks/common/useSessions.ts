import type { SessionsFilters } from "@shared/src";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/admin/queries/useModel/lib/query-keys";
import { query_client } from "@/lib/api";
import { SessionsApi } from "@/lib/api/services";
import { useToast } from "./useToast";

const invalidate_queries = (filters: Partial<SessionsFilters>) => {
  query_client.invalidateQueries({
    queryKey: QUERY_KEYS("SESSION").get(filters),
    exact: false,
  });
};
/**
 * Hook for working with user sessions
 */
export const useSessions = (filters: SessionsFilters) => {
  const api = new SessionsApi();
  const toast = useToast();
  /**
   * Getting active user sessions
   */
  const useGet = (filters: SessionsFilters) =>
    useQuery({
      queryKey: QUERY_KEYS("SESSION").get(filters),
      queryFn: () => api.get(filters),
      enabled: !!filters.user_id,
      select: (data) => data.data,
    });

  /**
   * Deactivating specific session
   */
  const useDeactivate = () =>
    useMutation({
      mutationFn: api.deactivate_session,
      onSuccess: () => {
        toast.success("Session has been deactivated successfully");
        invalidate_queries(filters);
      },
      onError: (error) => toast.error(error.message),
    });

  /**
   * Deactivating all other sessions (except the current one)
   */
  const useDeactivateAll = () =>
    useMutation({
      mutationFn: () => api.deactivate_all_sessions(filters.user_id),
      onSuccess: () => {
        toast.success("All sessions have been deactivated successfully");
        invalidate_queries(filters);
      },
      onError: (error) => toast.error(error.message),
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (session_id: string) => api.delete_session(session_id),
      onSuccess: () => {
        toast.success("Session has been deleted successfully");
        invalidate_queries(filters);
      },
      onError: (error) => toast.error(error.message),
    });

  return {
    useGet,
    useDeactivate,
    useDeactivateAll,
    useDelete,
  };
};
