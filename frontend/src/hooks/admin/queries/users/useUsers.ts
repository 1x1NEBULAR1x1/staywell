import type { AdminUpdateUser, UpdateUser, UsersFilters } from "@shared/src";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/common/useToast";
import { query_client, UsersApi } from "@/lib/api";
import { QUERY_KEYS } from "../useModel/lib/query-keys";
import type { FindQueryOptions } from "../useModel/lib/types";

const invalidate_queries = (id?: string) => {
  query_client.invalidateQueries({ queryKey: ["users"], exact: false });
  if (id) query_client.invalidateQueries({ queryKey: ["user", id] });
};

/**
 * Хук для работы с пользователями
 */
export const useUsers = () => {
  const api = new UsersApi();
  const toast = useToast();

  const get = (filters: UsersFilters) => {
    return useQuery({
      queryKey: ["users", filters],
      queryFn: () => api.get(filters),
      select: (data) => data.data,
    });
  };

  const update = (id: string) => {
    return useMutation({
      mutationFn: (data: UpdateUser | AdminUpdateUser) =>
        api.update({ id }, data),
      onSuccess: () => {
        toast.success("User has been updated successfully");
        invalidate_queries(id);
      },
    });
  };

  const find = (id: string, options?: FindQueryOptions<"USER">) => {
    return useQuery({
      queryKey: QUERY_KEYS("USER").find(id),
      queryFn: () => api.find({ id }),
      select: (data) => data.data,
      enabled: options?.enabled === undefined ? true : options.enabled,
    });
  };

  return {
    get,
    update,
    find,
  };
};
