import type { ExtendedBooking } from "@shared/src";
import { BadgeAlert } from "lucide-react";
import Link from "next/link";
import classes from "./PendingMessage.module.scss";

export const PendingMessage = ({ booking }: { booking: ExtendedBooking }) => {
  return (
    <div className={classes.pending_message}>
      <div className={classes.pending_icon}>
        <BadgeAlert size={80} color="yellow" />
      </div>
      <h3 className={classes.pending_title}>Payment Processing</h3>
      <p className={classes.pending_description}>
        Your booking #{booking.id} for {booking.booking_variant.apartment.name}{" "}
        is being paused. You can continue the payment process by clicking the
        button below in{" "}
        <Link href={`/bookings/${booking.id}`}>Booking Details</Link>. If you
        don't complete the payment within 24 hours, your booking will be
        cancelled.
      </p>
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
  );
};
