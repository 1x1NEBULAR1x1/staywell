"use client";

import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { useCallback, useEffect, useId } from "react";
import { Loader } from "@/components/common/Loader";
import { ApartmentCardSkeleton } from "@/components/common/Skeletons";
import classes from "./ApartmentsList.module.scss";
import { ApartmentCard, Header } from "./components";

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
  const id = useId();
  // Infinite scroll
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
      <Header isLoading={isLoading} total={apartments.length} />

      <div className={classes.apartments_grid}>
        {/* Show skeletons while loading initial data */}
        {isLoading &&
          apartments.length === 0 &&
          Array.from({ length: 6 }).map(() => (
            <ApartmentCardSkeleton key={`${id}-skeleton`} />
          ))}

        {/* Show actual apartments */}
        {apartments.map((apartment) => (
          <ApartmentCard key={apartment.id} apartment={apartment} />
        ))}
      </div>

      {/* Show loader when fetching next page */}
      {isFetchingNextPage && (
        <div className={classes.loading_more}>
          <Loader size="small" text="Loading more apartments..." />
        </div>
      )}
    </section>
  );
};
