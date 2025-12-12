import type { ExtendedEvent } from "@shared/src/types/events-section/extended.types";
import { format } from "date-fns";
import Link from "next/link";
import classes from "./EventCard.module.scss";

export const EventCard = ({ event }: { event: ExtendedEvent }) => {
  return (
    <Link className={classes.event_card} href={`/events/${event.id}`}>
      <div className={classes.event_image}>
        <img src={event.image} alt={event.name} />
        <div className={classes.badge}>
          ${event.price}
          <p className={classes.per_person}>per person</p>
        </div>
      </div>

      <div className={classes.event_info}>
        <div className={classes.apartment_header}>
          <h3 className={classes.event_name}>{event.name}</h3>
        </div>

        <div className={classes.apartment_details}>
          <div className={classes.detail}>
            <span className={classes.label}>Capacity:</span>
            <span>{event.capacity} guests</span>
          </div>
          <div className={classes.detail}>
            <span className={classes.label}>Start:</span>
            <span>
              {format(new Date(event.start), "dd MMMM yyyy")} at{" "}
              {format(new Date(event.start), "HH:mm")}
            </span>
          </div>
          <div className={classes.detail}>
            <span className={classes.label}>End:</span>
            <span>
              {format(new Date(event.end), "dd MMMM yyyy")} at{" "}
              {format(new Date(event.end), "HH:mm")}
            </span>
          </div>
        </div>

        {event.description && (
          <p className={classes.event_description}>
            {event.description.length > 100
              ? `${event.description.substring(0, 100)}...`
              : event.description}
          </p>
        )}

        <div className={classes.event_availability}>
          <span className={classes.availability}>
            {event.available_spots} spots available
          </span>
        </div>
      </div>
    </Link>
  );
};
