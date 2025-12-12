import type { EventsFilters, ExtendedEvent } from "@shared/src";
import type { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { GetApi } from "@/lib/api";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";

/**
 * Hook for infinite loading events
 * @param filters - additional filters for the search
 * @param options - options for the query
 * @returns Data with infinite loading
 */
export const useInfinityEvents = (
  filters: Omit<EventsFilters, "skip"> = { take: 12 },
  options?: {
    enabled?: boolean;
    initial_data?: BaseListResult<ExtendedEvent>;
  },
) => {
  const { selected_dates, guests, selected_events } = useBookingStore();
  const api = new GetApi("EVENT");
  const query = useInfiniteQuery({
    queryKey: ["events", "infinite", filters, selected_dates, guests],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await api.get({
        ...filters,
        skip: pageParam * filters.take,
        min_start: filters.min_start || selected_dates.start,
        max_end: filters.max_end || selected_dates.end,
        min_capacity: guests,
      });
      return result.data;
    },
    getNextPageParam: (
      last_page: BaseListResult<ExtendedEvent> | undefined,
      pages,
    ) => {
      if (!last_page) return undefined;
      const has_more = last_page.items.length === filters.take;
      return has_more ? pages.length : undefined;
    },
    initialPageParam: 0,
    enabled: options?.enabled !== false && Boolean(selected_dates.start),
    initialData: options?.initial_data
      ? {
          pages: [options.initial_data],
          pageParams: [0],
        }
      : undefined,
  });

  // Flat array of all events, filtered by availability and not selected
  const events = useMemo(() => {
    const allEvents =
      query.data?.pages.flatMap((page) => page?.items || []) || [];
    return allEvents
      .filter((event) => event.available_spots >= guests)
      .filter(
        (event) =>
          !selected_events.some((selected) => selected.event_id === event.id),
      )
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [query.data, guests, selected_events]);

  // Function to load the next page
  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // Total number of elements (from the first page)
  const total_count = query.data?.pages[0]?.total || 0;

  return {
    events,
    total_count,
    loadMore,
    ...query,
  };
};
