import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { format } from "date-fns";
import { Calendar, MapPin, Plus, Users } from "lucide-react";
import { useMemo } from "react";
import { useModel } from "@/hooks/admin/queries";
import { useBookingEvents } from "@/hooks/public";
import { useBookingAdditionalOptions } from "@/hooks/public/booking/useBookingAdditionalOptions";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import classes from "./Details.module.scss";

export const Details = ({ apartment }: { apartment?: ExtendedApartment }) => {
  const {
    selected_dates,
    selected_events,
    selected_booking_variant_id,
    selected_additional_options,
  } = useBookingStore();

  const { data: current_booking_variant } = useModel("BOOKING_VARIANT").find(
    selected_booking_variant_id ?? "",
    { enabled: !!selected_booking_variant_id },
  );
  const { events } = useBookingEvents();
  const { additional_options } = useBookingAdditionalOptions();

  const nights = useMemo(() => {
    if (!selected_dates.start || !selected_dates.end) return 0;
    return Math.ceil(
      (selected_dates.end.getTime() - selected_dates.start.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }, [selected_dates.start, selected_dates.end]);

  return (
    <div className={classes.booking_details}>
      <h3>Booking details</h3>

      <div className={classes.detail_cards}>
        <div className={classes.detail_card}>
          <div className={classes.card_icon}>
            <Calendar size={24} />
          </div>
          <div className={classes.card_content}>
            <h4>Dates of stay</h4>
            {selected_dates.start && selected_dates.end && (
              <p>
                {format(selected_dates.start, "dd MMMM yyyy")} -{" "}
                {format(selected_dates.end, "dd MMMM yyyy")}
              </p>
            )}
            <span className={classes.nights}>
              {nights}{" "}
              {nights === 1 ? "night" : nights < 5 ? "nights" : "nights"}
            </span>
          </div>
        </div>

        <div className={classes.detail_card}>
          <div className={classes.card_icon}>
            <MapPin size={24} />
          </div>
          <div className={classes.card_content}>
            <h4>Apartments</h4>
            <p>Apartments "{apartment?.name}"</p>
            <span className={classes.price}>
              {!!apartment?.deposit && `${apartment?.deposit?.toFixed(2)} $ + `}
              {current_booking_variant?.price?.toFixed(2)} $ × {nights} ={" "}
              {(
                (apartment?.deposit ?? 0) +
                (current_booking_variant?.price ?? 0) * nights
              )?.toFixed(2)}{" "}
              $
            </span>
          </div>
        </div>

        {selected_events.length > 0 && (
          <div className={classes.detail_card}>
            <div className={classes.card_icon}>
              <Users size={24} />
            </div>
            <div className={classes.card_content}>
              <h4>Events</h4>
              <p>
                {selected_events.length}{" "}
                {selected_events.length === 1
                  ? "event"
                  : selected_events.length < 5
                    ? "events"
                    : "events"}
              </p>
              <span className={classes.price}>
                {events
                  .reduce((total, event) => {
                    const selected_event = selected_events.find(
                      (e) => e.event_id === event.id,
                    );
                    if (selected_event) {
                      return (
                        total + event.price * selected_event.number_of_people
                      );
                    }
                    return total;
                  }, 0)
                  .toFixed(2)}{" "}
                $
              </span>
            </div>
          </div>
        )}

        {selected_additional_options.length > 0 && (
          <div className={classes.detail_card}>
            <div className={classes.card_icon}>
              <Plus size={24} />
            </div>
            <div className={classes.card_content}>
              <h4>Additional Options</h4>
              <p>
                {selected_additional_options.length}{" "}
                {selected_additional_options.length === 1
                  ? "option"
                  : selected_additional_options.length < 5
                    ? "options"
                    : "options"}
              </p>
              <span className={classes.price}>
                {additional_options
                  .reduce((total, option) => {
                    const selected_option = selected_additional_options.find(
                      (ao) => ao.additional_option_id === option.id,
                    );
                    if (selected_option) {
                      return total + option.price * selected_option.amount;
                    }
                    return total;
                  }, 0)
                  .toFixed(2)}{" "}
                $
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
