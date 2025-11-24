import { useInfiniteQuery } from '@tanstack/react-query';
import { GetApi } from '@/lib/api';
import type { ApartmentsFilters, ExtendedApartment } from '@shared/src';
import type { BaseListResult } from '@shared/src/common/base-types/base-list-result.interface';
import { useCallback, useMemo } from 'react';

const api = new GetApi('APARTMENT');

/**
 * Hook for infinite loading apartments
 * @param filters - filters for the search
 * @param options - options for the query
 * @returns Data with infinite loading
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
      const result = await api.get({
        ...filters,
        skip: pageParam * take,
        take,
      });
      return result.data;
    },
    getNextPageParam: (last_page: BaseListResult<ExtendedApartment>, pages) => {
      const has_more = last_page.items.length === take;
      return has_more ? pages.length : undefined;
    },
    initialPageParam: 0,
    enabled: options?.enabled !== false,
  });

  // Flat array of all apartments
  const apartments = useMemo(() => {
    return query.data?.pages.flatMap(page => page.items) || [];
  }, [query.data]);

  // Function to load the next page
  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // Total number of elements (from the first page)
  const total_count = query.data?.pages[0]?.total || 0;

  return {
    apartments,
    total_count,
    loadMore,
    ...query,
  };
};
