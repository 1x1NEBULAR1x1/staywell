"use client";

import { format } from "date-fns";
import { Calendar, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import no_image from "@/../public/common/no-image.jpeg";
import { useBookingEvents } from "@/hooks/public/booking/useBookingEvents";
import { getImageUrl } from "@/lib/api/utils/image-url";
import {
  type SelectedEvent,
  useBookingStore,
} from "@/stores/public/pages/booking/useBookingStore";
import classes from "./SelectedEventCard.module.scss";

export const SelectedEventCard = ({
  selected_event,
}: {
  selected_event: SelectedEvent;
}) => {
  const { events } = useBookingEvents();

  const event = events.find((event) => event.id === selected_event.event_id);

  const { updateEventPeople, removeEvent } = useBookingEvents();
  const { guests } = useBookingStore();

  const handleUpdatePeople = (newCount: number) => {
    if (newCount < 1 || newCount > guests) return;
    updateEventPeople(selected_event.event_id, newCount);
  };

  const handleRemove = () => {
    removeEvent(selected_event.event_id);
  };

  const increment = () =>
    handleUpdatePeople(selected_event.number_of_people + 1);
  const decrement = () =>
    handleUpdatePeople(selected_event.number_of_people - 1);

  const can_add_people =
    selected_event.number_of_people < guests &&
    (event?.available_spots ?? 0) >= selected_event.number_of_people;

  return (
    event && (
      <div className={classes.card}>
        {/* Image */}
        <div className={classes.image_container}>
          <Image
            src={getImageUrl(event.image) ?? no_image.src}
            alt={event.name}
            className={classes.image}
            width={500}
            height={500}
            quality={100}
          />
          <button
            type="button"
            className={classes.remove_button}
            onClick={handleRemove}
            title="Remove event"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Content */}
        <div className={classes.content}>
          <div className={classes.info}>
            <h3 className={classes.title}>{event.name}</h3>

            <div className={classes.datetime}>
              <Calendar size={16} />
              <span>
                {format(new Date(event.start), "dd.MM HH:mm")} to{" "}
                {format(new Date(event.end), "dd.MM HH:mm")}
              </span>
            </div>
          </div>
          {/* Controls */}
          <div className={classes.controls}>
            <div className={classes.people_control}>
              <span className={classes.people_label}>Guests:</span>
              <div className={classes.counter}>
                <button
                  type="button"
                  className={classes.counter_button}
                  onClick={decrement}
                  disabled={selected_event.number_of_people <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className={classes.count}>
                  {selected_event.number_of_people}
                </span>
                <button
                  type="button"
                  className={classes.counter_button}
                  onClick={increment}
                  disabled={!can_add_people}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className={classes.price_info}>
              <span className={classes.unit_price}>
                ${event.price.toFixed(2)} × {selected_event.number_of_people}
              </span>
              <span className={classes.total_price}>
                ${(event.price * selected_event.number_of_people).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
