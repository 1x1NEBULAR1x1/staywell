import { useInfiniteQuery } from '@tanstack/react-query';
import { GetApi } from '@/lib/api';
import { ApartmentsFilters, ExtendedApartment, BaseListResult } from '@shared/src';
import { useCallback, useMemo } from 'react';

const apartmentsApi = new GetApi('APARTMENT');

/**
 * Хук для бесконечной загрузки квартир
 * @param filters - фильтры для поиска квартир
 * @param options - опции запроса
 * @returns Данные с бесконечной загрузкой
 */
export const useInfinityApartments = (
  filters: Omit<ApartmentsFilters, 'skip'> & { take?: number },
  options?: {
    enabled?: boolean;
  }
) => {
  const take = filters.take || 10;

  const query = useInfiniteQuery({
    queryKey: ['apartments', 'infinite', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await apartmentsApi.get({
        ...filters,
        skip: pageParam * take,
        take,
      });
      return result.data;
    },
    getNextPageParam: (lastPage: BaseListResult<ExtendedApartment>, pages) => {
      const hasMore = lastPage.items.length === take;
      return hasMore ? pages.length : undefined;
    },
    initialPageParam: 0,
    enabled: options?.enabled !== false,
  });

  // Плоский массив всех квартир
  const apartments = useMemo(() => {
    return query.data?.pages.flatMap(page => page.items) || [];
  }, [query.data]);

  // Функция для загрузки следующей страницы
  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // Общее количество элементов (из первой страницы)
  const totalCount = query.data?.pages[0]?.total || 0;

  return {
    apartments,
    totalCount,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    loadMore,
    refetch: query.refetch,
    error: query.error,
    isError: query.isError,
  };
};
