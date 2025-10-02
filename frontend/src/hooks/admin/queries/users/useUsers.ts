import { useQuery, useMutation } from "@tanstack/react-query";
import { UsersApi, query_client } from "@/lib/api";
import { useToast } from "@/hooks/common/useToast";
import { UsersFilters, UpdateUser, AdminUpdateUser } from '@shared/src';

const invalidate_queries = (id?: string) => {
  query_client.invalidateQueries({ queryKey: ['users'], exact: false });
  if (id) query_client.invalidateQueries({ queryKey: ['user', id] });
}

/**
 * Хук для работы с пользователями
 */
export const useUsers = () => {
  const usersApi = new UsersApi()
  const toast = useToast()

  const get = (filters: UsersFilters) => useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.get(filters),
    select: (data) => data.data,
  });

  const update = (id: string) => useMutation({
    mutationFn: (data: UpdateUser | AdminUpdateUser) => usersApi.update({ id }, data),
    onSuccess: () => {
      toast.success('User has been updated successfully')
      invalidate_queries(id)
    }
  });

  const find = (id: string) => useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.find(id),
    select: data => data.data
  })

  return {
    get,
    update,
    find
  };
};