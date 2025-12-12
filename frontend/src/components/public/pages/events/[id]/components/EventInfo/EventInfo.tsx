"use client";
import type { ExtendedEvent } from "@shared/src";
import { Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";
import classes from "./EventInfo.module.scss";

export const EventInfo = ({ event }: { event: ExtendedEvent }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className={classes.event_info}>
      <div className={classes.main_section}>
        <div className={classes.info_content}>
          <h3 className={classes.section_title}>About the event</h3>
          {event.description && (
            <p className={classes.description}>{event.description}</p>
          )}

          <div className={classes.event_details}>
            <div className={classes.detail_item}>
              <Calendar className={classes.detail_icon} />
              <div className={classes.detail_content}>
                <span className={classes.detail_label}>Date</span>
                <span className={classes.detail_value}>
                  {formatDate(event.start)}
                </span>
              </div>
            </div>

            <div className={classes.detail_item}>
              <Clock className={classes.detail_icon} />
              <div className={classes.detail_content}>
                <span className={classes.detail_label}>Time</span>
                <span className={classes.detail_value}>
                  {formatTime(event.start)} - {formatTime(event.end)}
                </span>
              </div>
            </div>

            <div className={classes.detail_item}>
              <Users className={classes.detail_icon} />
              <div className={classes.detail_content}>
                <span className={classes.detail_label}>Capacity</span>
                <span className={classes.detail_value}>
                  {event.available_spots} spots available
                </span>
              </div>
            </div>

            {event.guide && (
              <div className={classes.detail_item}>
                <div className={classes.guide_avatar}>
                  {event.guide.first_name?.[0]}
                  {event.guide.last_name?.[0]}
                </div>
                <div className={classes.detail_content}>
                  <span className={classes.detail_label}>Guide</span>
                  <span className={classes.detail_value}>
                    {event.guide.first_name} {event.guide.last_name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={classes.booking_section}>
          <div className={classes.booking_card}>
            <h3 className={classes.booking_title}>Join the Event</h3>

            <div className={classes.price_section}>
              <span className={classes.price}>${event.price}</span>
              <span className={classes.price_period}>per Person</span>
            </div>

            <div className={classes.availability}>
              <span className={classes.availability_text}>
                {event.available_spots > 0
                  ? `${event.available_spots} spots left`
                  : "Event full"}
              </span>
            </div>

            <Link
              href={`/events/${event.id}/booking`}
              className={`${classes.book_button} ${event.available_spots === 0 ? classes.book_button_disabled : ""}`}
            >
              {event.available_spots > 0 ? "Book Now" : "Event Full"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
