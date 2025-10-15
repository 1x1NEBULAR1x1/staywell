import { useQuery } from '@tanstack/react-query';
import { GetApi } from '@/lib/api';
import { ExtendedApartment } from '@shared/src';

const apartmentsApi = new GetApi('APARTMENT');

/**
 * Хук для получения одной квартиры по ID
 * @param id - ID квартиры
 * @param options - опции запроса
 * @returns Данные квартиры
 */
export const useApartment = (
  id: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['apartment', id],
    queryFn: () => apartmentsApi.find(id),
    select: (data) => data.data,
    enabled: options?.enabled !== false,
  });
};
