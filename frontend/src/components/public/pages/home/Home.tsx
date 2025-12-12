"use client";
import type { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
import type {
  ApartmentsFilters,
  ExtendedApartment,
} from "@shared/src/types/apartments-section";
import { useState } from "react";
import { Filters } from "@/components/public/common/components/Filters";
import { useModelFilters } from "@/hooks/admin/actions";
import { useInfinityApartments } from "@/hooks/public/apartments/useInfinityApartments";
import { ApartmentsList } from "../apartments/components";
import { Features, Hero, Recomendations } from "./components";
import classes from "./Home.module.scss";

export const Home = ({
  initial_data,
}: {
  initial_data?: BaseListResult<ExtendedApartment>;
}) => {
  const { filters, setFilters, debounced_filters } = useModelFilters({
    model: "APARTMENT",
  });
  const [is_toggle, setIsToggle] = useState(false);
  const { apartments, isLoading, loadMore, hasNextPage, isFetchingNextPage } =
    useInfinityApartments(debounced_filters, { enabled: is_toggle });

  const updateFilters = (new_filters: Partial<ApartmentsFilters>) => {
    if (!is_toggle) setIsToggle(true);
    setFilters({ ...filters, ...new_filters });
  };

  return (
    <div className={classes.page}>
      <Hero />

      <Filters filters={filters} updateFilters={updateFilters} />

      {!is_toggle ? (
        <Recomendations apartments={initial_data?.items || []} />
      ) : (
        <ApartmentsList
          apartments={apartments}
          isLoading={isLoading}
          loadMore={loadMore}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      <Features />
    </div>
  );
};
