"use client";

import type { ApartmentsFilters } from "@shared/src/types/apartments-section";
import { useModelFilters } from "@/hooks/admin/actions";
import { useInfinityApartments } from "@/hooks/public/apartments/useInfinityApartments";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import classes from "./Apartments.module.scss";
import { ApartmentsList } from "./components/ApartmentsList";
import { Filters } from "./components/Filters";
import { Header } from "./components/Header";

export const Apartments = () => {
  const { setSelectedDates, selected_dates, guests, setGuests } =
    useBookingStore();
  console.log("guests", guests);
  console.log("selected_dates", selected_dates);
  const { filters, setFilters, debounced_filters } = useModelFilters({
    model: "APARTMENT",
    default_filters: {
      min_capacity: guests,
      ...(selected_dates.start && { start_date: selected_dates.start }),
      ...(selected_dates.end && { end_date: selected_dates.end }),
      skip: 0,
      take: 30,
      is_available: false, //TODO: change to true
    },
    permanent_fields: { take: 30, skip: 0, is_available: false }, //TODO: change to true
    debounce_settings: {
      fields: ["start_date", "end_date", "min_price", "max_price"],
      delay: 500,
    },
  });
  console.log(filters.start_date, filters.end_date);

  const { apartments, isLoading, loadMore, hasNextPage, isFetchingNextPage } =
    useInfinityApartments(debounced_filters);

  const updateFilters = (new_filters: Partial<ApartmentsFilters>) => {
    if (new_filters.start_date && new_filters.end_date) {
      setFilters({
        ...filters,
        start_date: new_filters.start_date.toISOString() as unknown as Date,
        end_date: new_filters.end_date.toISOString() as unknown as Date,
        skip: 0,
      });
      setSelectedDates({
        start: new_filters.start_date,
        end: new_filters.end_date,
      });
      return;
    }
    if (new_filters.min_capacity) {
      setGuests(new_filters.min_capacity);
    }
    // When min_capacity is set, also set guests for backend filtering
    const updated_filters = { ...new_filters };
    if (new_filters.min_capacity) {
      updated_filters.guests = new_filters.min_capacity;
    }
    setFilters({ ...filters, ...updated_filters, skip: 0 });
  };

  return (
    <div className={classes.page}>
      <Header />

      <Filters filters={filters} updateFilters={updateFilters} />

      <ApartmentsList
        apartments={apartments}
        isLoading={isLoading}
        loadMore={loadMore}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};
