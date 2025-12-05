import type { AdditionalOption, AdditionalOptionsFilters } from "@shared/src";
import type { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { GetApi } from "@/lib/api";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";

/**
 * Hook for infinite loading additional options
 * @param filters - additional filters for the search
 * @param options - options for the query
 * @returns Data with infinite loading
 */
export const useInfinityAdditionalOptions = (
  filters: Omit<AdditionalOptionsFilters, "skip"> = { take: 12 },
  options?: {
    enabled?: boolean;
  },
) => {
  const { selected_additional_options } = useBookingStore();
  const api = new GetApi("ADDITIONAL_OPTION");

  const query = useInfiniteQuery({
    queryKey: ["additional-options", "infinite", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await api.get({
        ...filters,
        skip: pageParam * filters.take,
      });
      return result.data;
    },
    getNextPageParam: (
      last_page: BaseListResult<AdditionalOption> | undefined,
      pages,
    ) => {
      if (!last_page) return undefined;
      const has_more = last_page.items.length === filters.take;
      return has_more ? pages.length : undefined;
    },
    initialPageParam: 0,
    enabled: options?.enabled !== false,
  });

  // Flat array of all additional options, filtered by not selected
  const additional_options = useMemo(() => {
    const allAdditionalOptions =
      query.data?.pages.flatMap((page) => page?.items || []) || [];
    return allAdditionalOptions
      .filter(
        (option) =>
          !selected_additional_options.some(
            (selected) => selected.additional_option_id === option.id,
          ),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query.data, selected_additional_options]);

  // Function to load the next page
  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // Total number of elements (from the first page)
  const total_count = query.data?.pages[0]?.total || 0;

  return {
    additional_options,
    total_count,
    loadMore,
    ...query,
  };
};
