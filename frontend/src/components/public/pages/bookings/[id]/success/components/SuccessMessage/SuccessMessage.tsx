import type { ExtendedBooking } from "@shared/src";
import { format } from "date-fns";
import { BadgeCheck, Calendar, DollarSign, Home, Mail } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import classes from "./SuccessMessage.module.scss";

export const SuccessMessage = ({ booking }: { booking: ExtendedBooking }) => {
  const start_date = booking.start ? new Date(booking.start) : null;
  const end_date = booking.end ? new Date(booking.end) : null;
  const nights =
    start_date && end_date
      ? Math.ceil(
          (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

  const total_price = useMemo(() => {
    const booking_price =
      booking.booking_variant.apartment.deposit +
      booking.booking_variant.price * nights;
    const options_price = booking.booking_additional_options.reduce(
      (total, option) => total + option.additional_option.price * option.amount,
      0,
    );
    const events_price = booking.booking_events.reduce(
      (total, event) => total + event.event.price * event.number_of_people,
      0,
    );
    return booking_price + options_price + events_price;
  }, [
    booking.booking_variant.apartment.deposit,
    booking.booking_variant.price,
    nights,
    booking.booking_additional_options,
    booking.booking_events,
  ]);

  return (
    <div className={classes.success_container}>
      <div className={classes.success_card}>
        {/* Success Icon with Animation */}
        <div className={classes.icon_wrapper}>
          <div className={classes.success_icon}>
            <BadgeCheck size={80} />
          </div>
          <div className={classes.icon_glow}></div>
        </div>

        {/* Main Message */}
        <div className={classes.message_section}>
          <h2 className={classes.title}>Booking Confirmed!</h2>
          <p className={classes.subtitle}>
            Your payment has been processed successfully
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className={classes.booking_summary}>
          <div className={classes.summary_header}>
            <h3>Booking Summary</h3>
            <div className={classes.booking_number}>
              <span>Confirmation #</span>
              <code>{booking.id.split("-")[0]}</code>
            </div>
          </div>

          <div className={classes.summary_grid}>
            <div className={classes.summary_item}>
              <div className={classes.item_icon}>
                <Home size={20} />
              </div>
              <div className={classes.item_content}>
                <span className={classes.item_label}>Apartment</span>
                <span className={classes.item_value}>
                  {booking.booking_variant.apartment.name}
                </span>
              </div>
            </div>

            {start_date && end_date && (
              <div className={classes.summary_item}>
                <div className={classes.item_icon}>
                  <Calendar size={20} />
                </div>
                <div className={classes.item_content}>
                  <span className={classes.item_label}>
                    Check-in / Check-out
                  </span>
                  <span className={classes.item_value}>
                    {format(start_date, "MMM dd, yyyy")} -{" "}
                    {format(end_date, "MMM dd, yyyy")}
                  </span>
                  <span className={classes.item_detail}>
                    {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              </div>
            )}

            {total_price !== undefined && (
              <div className={classes.summary_item}>
                <div className={classes.item_icon}>
                  <DollarSign size={20} />
                </div>
                <div className={classes.item_content}>
                  <span className={classes.item_label}>Total Paid</span>
                  <span className={classes.item_value_amount}>
                    ${total_price.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Email Notification */}
          <div className={classes.email_notification}>
            <Mail size={18} />
            <span>
              A confirmation email has been sent to your email address
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={classes.actions}>
          <Link
            href={`/bookings/${booking.id}`}
            className={classes.primary_button}
          >
            View Booking Details
          </Link>
          <Link href="/bookings" className={classes.secondary_button}>
            Back to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};
