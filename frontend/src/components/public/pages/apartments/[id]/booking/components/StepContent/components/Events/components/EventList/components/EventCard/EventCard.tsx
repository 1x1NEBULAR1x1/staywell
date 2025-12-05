"use client";

import type { ExtendedEvent } from "@shared/src";
import { format } from "date-fns";
import { Calendar, Plus, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import no_image from "@/../public/common/no-image.jpeg";
import { useBookingEvents } from "@/hooks/public/booking/useBookingEvents";
import { getImageUrl } from "@/lib/api/utils/image-url";
import classes from "./EventCard.module.scss";

export const EventCard = ({ event }: { event: ExtendedEvent }) => {
  const { addEvent } = useBookingEvents();

  return (
    <Link href={`/events/${event.id}`} target="_blank" className={classes.card}>
      {/* Image */}
      <div className={classes.image_container}>
        <Image
          src={getImageUrl(event.image) || no_image.src}
          alt={event.name}
          className={classes.image}
          width={500}
          height={500}
          quality={100}
        />
        <div className={classes.price_badge}>${event.price.toFixed(2)}</div>
      </div>

      {/* Content */}
      <div className={classes.content}>
        <div className={classes.info}>
          <h3 className={classes.title}>{event.name}</h3>

          <div className={classes.datetime}>
            <Calendar size={16} />
            <span>
              <p>
                From {format(new Date(event.start), "dd MMMM yyyy")} at{" "}
                {format(new Date(event.start), "HH:mm")}
              </p>
              <p>
                To {format(new Date(event.end), "dd MMMM yyyy")} at{" "}
                {format(new Date(event.end), "HH:mm")}
              </p>
            </span>
          </div>

          {event.guide && (
            <div className={classes.guide}>
              <User size={16} />
              <span>
                {event.guide.first_name} {event.guide.last_name}
              </span>
            </div>
          )}

          <p className={classes.description}> {event.description} </p>
        </div>

        <div className={classes.controls}>
          <div className={classes.capacity}>
            <Users size={16} />
            <span>
              Available: {event.available_spots} of {event.capacity}
            </span>
          </div>
          <button
            type="button"
            className={classes.add_button}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addEvent(event.id);
            }}
            disabled={event.available_spots === 0}
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};
