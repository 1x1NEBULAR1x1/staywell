import { useQuery } from "@tanstack/react-query";
import { GetApi } from "@/lib/api";

const apartmentsApi = new GetApi("APARTMENT");

/**
 * Hook for getting one apartment by ID
 * @param id - Apartment ID
 * @param options - query options
 * @returns Apartment data
 */
export const useApartment = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: ["apartment", id],
    queryFn: () => apartmentsApi.find(id),
    select: (data) => data.data,
    enabled: options?.enabled !== false,
  });
};
