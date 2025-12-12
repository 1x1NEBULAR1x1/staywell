"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@/components/common/Loader";
import { useModelFilters } from "@/hooks/admin/actions/useModelFilters/useModelFilters";
import { useInfinityAdditionalOptions } from "@/hooks/public/booking/useInfinityAdditionalOptions";
import { AdditionalOptionsFilters } from "../AdditionalOptionsFilters";
import classes from "./AdditionalOptionList.module.scss";
import { AdditionalOptionCard } from "./components/AdditionalOptionCard";

export const AdditionalOptionList = () => {
  const { filters, setFilters } = useModelFilters({
    model: "ADDITIONAL_OPTION",
    default_filters: { take: 12, skip: 0 },
  });

  const {
    additional_options,
    loadMore,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  } = useInfinityAdditionalOptions(filters);
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  if (isLoading && additional_options.length === 0) {
    return (
      <div className={classes.container}>
        <AdditionalOptionsFilters filters={filters} setFilters={setFilters} />
        <div className={classes.loading_container}>
          <Loader size="medium" text="Loading additional options..." />
        </div>
      </div>
    );
  }

  if (additional_options.length === 0 && !isLoading) {
    return (
      <div className={classes.container}>
        <AdditionalOptionsFilters filters={filters} setFilters={setFilters} />
        <div className={classes.empty_state}>
          <p>No additional options available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <AdditionalOptionsFilters filters={filters} setFilters={setFilters} />
      <div className={classes.additional_options_list}>
        {additional_options.map((option) => (
          <AdditionalOptionCard key={option.id} additional_option={option} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={observerRef} className={classes.loading_trigger}>
          {isFetchingNextPage && (
            <div className={classes.loading}>
              <Loader size="small" text="Loading more options..." />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
