"use client";

import type { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
import type { EventsFilters as EventsFiltersType } from "@shared/src/types/events-section";
import type { ExtendedEvent } from "@shared/src/types/events-section/extended.types";
import { useModelFilters } from "@/hooks/admin/actions";
import { useInfinityEvents } from "@/hooks/public/booking/useInfinityEvents";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import { EventsFilters } from "./components/EventsFilters";
import { EventsList } from "./components/EventsList";
import { Header } from "./components/Header";
import classes from "./Events.module.scss";

export const Events = ({
  initial_data,
}: {
  initial_data: BaseListResult<ExtendedEvent>;
}) => {
  const { setSelectedDates, selected_dates, guests, setGuests } =
    useBookingStore();
  const { filters, setFilters, debounced_filters } = useModelFilters({
    model: "EVENT",
    default_filters: {
      min_capacity: guests,
      ...(selected_dates.start
        ? { min_start: selected_dates.start }
        : { min_start: new Date(Date.now()).toISOString() as unknown as Date }),
      ...(!!selected_dates.end && { max_end: selected_dates.end }),
      skip: 0,
      take: 30,
    },
    permanent_fields: { take: 30, skip: 0 },
    debounce_settings: {
      fields: ["min_start", "max_end", "min_price", "max_price"],
      delay: 500,
    },
  });
  const { events, isLoading, loadMore, hasNextPage, isFetchingNextPage } =
    useInfinityEvents(debounced_filters, { initial_data });

  const updateFilters = (new_filters: Partial<EventsFiltersType>) => {
    if (new_filters.min_start) {
      setFilters({
        ...filters,
        min_start: new_filters.min_start.toISOString() as unknown as Date,
        max_end: new_filters.max_end
          ? (new_filters.max_end.toISOString() as unknown as Date)
          : undefined,
        skip: 0,
      });
      setSelectedDates({
        start: new_filters.min_start,
        end: new_filters.max_end ? new_filters.max_end : undefined,
      });
      return;
    }
    if (new_filters.min_capacity) {
      setGuests(new_filters.min_capacity);
    }
    // When min_capacity is set, also set guests for backend filtering
    const updated_filters = { ...new_filters };
    if (new_filters.min_capacity) {
      updated_filters.min_capacity = new_filters.min_capacity;
    }
    setFilters({ ...filters, ...updated_filters, skip: 0 });
  };

  return (
    <div className={classes.page}>
      <Header />

      <EventsFilters filters={filters} updateFilters={updateFilters} />

      <EventsList
        events={events}
        isLoading={isLoading}
        loadMore={loadMore}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};
