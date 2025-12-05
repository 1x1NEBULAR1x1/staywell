"use client";

import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBookingEvents } from "@/hooks/public";
import { useBookingState } from "@/hooks/public/booking";
import { SelectedEventCard } from "./components/SelectedEventCard/SelectedEventCard";
import classes from "./SelectedEvents.module.scss";

export const SelectedEvents = () => {
  const { selected_events } = useBookingEvents();
  const { events: allEvents } = useBookingEvents();
  const { getNextStep } = useBookingState();
  const { id } = useParams<{ id: string }>();

  // Calculate total price
  const totalPrice = selected_events.reduce((total, selected_event) => {
    const event = allEvents.find((e) => e.id === selected_event.event_id);
    return total + (event?.price || 0) * selected_event.number_of_people;
  }, 0);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Users size={20} />
        <h3>Selected events ({selected_events.length})</h3>
      </div>

      <div className={classes.events_scroll}>
        {selected_events.length > 0 ? (
          selected_events.map((selected_event) => (
            <SelectedEventCard
              key={`${selected_event.event_id}-${selected_event.number_of_people}`}
              selected_event={selected_event}
            />
          ))
        ) : (
          <div className={classes.empty_state}>
            <span>No events selected</span>
          </div>
        )}
      </div>

      {selected_events.length > 0 && (
        <div className={classes.summary}>
          <div className={classes.total}>
            <span className={classes.total_label}>Total:</span>
            <span className={classes.total_amount}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <Link
            href={`/apartments/${id}/booking/${getNextStep("events")}`}
            className={classes.next_button}
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};
