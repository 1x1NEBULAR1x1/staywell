import type { ExtendedBooking } from "@shared/src";
import Link from "next/link";
import classes from "./BookingList.module.scss";

export const BookingList = ({ bookings }: { bookings: ExtendedBooking[] }) => {
  return (
    <div className={classes.booking_list}>
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/bookings/${booking.id}`}
          className={classes.booking_card}
        >
          <div className={classes.booking_info}>
            <div className={classes.booking_id}>Booking #{booking.id}</div>
            <div className={classes.apartment_name}>
              {booking.booking_variant.apartment.name}
            </div>
            <div
              className={classes.booking_status}
              data-status={booking.status}
            >
              {booking.status}
            </div>
          </div>
          <div className={classes.booking_dates}>
            <div className={classes.check_in}>
              Check-in: {new Date(booking.check_in).toLocaleDateString()}
            </div>
            <div className={classes.check_out}>
              Check-out: {new Date(booking.check_out).toLocaleDateString()}
            </div>
          </div>
          {booking.transaction && (
            <div className={classes.booking_amount}>
              ${booking.transaction.amount}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};
