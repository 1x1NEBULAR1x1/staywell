"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useModelFilters } from "@/hooks/admin/actions";
import { useInfinityEvents } from "@/hooks/public/booking/useInfinityEvents";
import { EventFilters } from "../EventFilters";
import { EventCard } from "./components/EventCard";
import classes from "./EventList.module.scss";

export const EventList = () => {
  const { filters, setFilters } = useModelFilters({
    model: "EVENT",
    default_filters: { take: 12, skip: 0 },
  });

  const { events, loadMore, isFetchingNextPage, hasNextPage } =
    useInfinityEvents(filters);
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

  return (
    <div className={classes.container}>
      <EventFilters filters={filters} setFilters={setFilters} />
      <div className={classes.events_list}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={observerRef} className={classes.loading_trigger}>
          {isFetchingNextPage && (
            <div className={classes.loading}>
              <Loader2 className={classes.spinner} size={20} />
              <span>Loading more events...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
