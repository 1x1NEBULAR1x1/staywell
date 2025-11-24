import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/lib/api';

const api = new GetApi('APARTMENT');

/**
 * Hook for getting one apartment by ID
 * @param id - Apartment ID
 * @param options - options for the query
 * @returns Apartment data
 */
export const useApartment = (
  id: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['apartment', id],
    queryFn: () => api.find(id),
    select: (data) => data.data,
    enabled: options?.enabled !== false,
  });
};
