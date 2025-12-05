"use client";

import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { useCallback, useEffect } from "react";
import classes from "./ApartmentsList.module.scss";
import { ApartmentCard } from "./components/ApartmentCard";

type ApartmentsListProps = {
  apartments: ExtendedApartment[];
  isLoading: boolean;
  loadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const ApartmentsList = ({
  apartments,
  isLoading,
  loadMore,
  hasNextPage,
  isFetchingNextPage,
}: ApartmentsListProps) => {
  // Бесконечная прокрутка
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetchingNextPage
    ) {
      return;
    }
    if (hasNextPage) loadMore();
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (apartments.length === 0 && !isLoading) {
    return (
      <section className={classes.apartments_section}>
        <div className={classes.container}>
          <div className={classes.empty_state}>
            <p>No apartments found matching your criteria</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={classes.apartments_section}>
      <div className={classes.results_header}>
        <p className={classes.results_count}>
          {apartments.length}{" "}
          {apartments.length === 1 ? "apartment" : "apartments"} found
        </p>
      </div>

      <div className={classes.apartments_grid}>
        {apartments.map((apartment) => (
          <ApartmentCard key={apartment.id} apartment={apartment} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className={classes.loading_more}>
          <p>Loading more apartments...</p>
        </div>
      )}
    </section>
  );
};
