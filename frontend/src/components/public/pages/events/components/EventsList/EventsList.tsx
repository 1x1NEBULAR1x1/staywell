"use client";

import type { ExtendedEvent } from "@shared/src/types/events-section/extended.types";
import { useCallback, useEffect, useId } from "react";
import { Loader } from "@/components/common/Loader";
import { EventCardSkeleton } from "@/components/common/Skeletons";
import { EventCard } from "./components";
import classes from "./EventsList.module.scss";

type EventsListProps = {
  events: ExtendedEvent[];
  isLoading: boolean;
  loadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const EventsList = ({
  events,
  isLoading,
  loadMore,
  hasNextPage,
  isFetchingNextPage,
}: EventsListProps) => {
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

  if (events.length === 0 && !isLoading) {
    return (
      <section className={classes.events_section}>
        <div className={classes.container}>
          <div className={classes.empty_state}>
            <p>No events found matching your criteria</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={classes.events_section}>
      {!isLoading && (
        <div className={classes.results_header}>
          <p className={classes.results_count}>
            {events.length} {events.length === 1 ? "event" : "events"} found
          </p>
        </div>
      )}

      <div className={classes.events_grid}>
        {/* Show skeletons while loading initial data */}
        {isLoading &&
          events.length === 0 &&
          Array.from({ length: 6 }).map(() => (
            <EventCardSkeleton key={`${id}-skeleton`} />
          ))}

        {/* Show actual events */}
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Show loader when fetching next page */}
      {isFetchingNextPage && (
        <div className={classes.loading_more}>
          <Loader size="small" text="Loading more events..." />
        </div>
      )}
    </section>
  );
};
