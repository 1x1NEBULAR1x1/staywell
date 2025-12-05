import type { ExtendedBooking } from "@shared/src";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import classes from "./SuccessMessage.module.scss";

export const SuccessMessage = ({ booking }: { booking: ExtendedBooking }) => {
  return (
    <div className={classes.success_message}>
      <div className={classes.success_icon}>
        <BadgeCheck size={80} color="green" />
      </div>
      <h3 className={classes.success_title}>Payment Successful!</h3>
      <p className={classes.success_description}>
        Your booking #{booking.id} for {booking.booking_variant.apartment.name}{" "}
        has been confirmed and payment has been processed successfully. You will
        receive a confirmation email shortly. You can view the booking details
        by clicking the button below.
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
