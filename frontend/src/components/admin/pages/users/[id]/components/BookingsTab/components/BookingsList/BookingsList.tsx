import classes from './BookingsList.module.scss';
import { ExtendedBooking } from '@shared/src';

export const BookingsList = ({ bookings }: { bookings: ExtendedBooking[] }) => {
  if (bookings.length === 0) {
    return <p className={classes.empty}>No bookings found</p>;
  }

  return (
    <div className={classes.bookings_list}>
      {bookings.map((booking) => (
        <div key={booking.id} className={classes.booking_item}>
          <div className={classes.booking_header}>
            <span className={classes.apartment_name}>
              {booking.booking_variant.apartment.name || `Apartment ${booking.booking_variant.apartment.number}`}
            </span>
            <span className={`${classes.status} ${classes[booking.status.toLowerCase()]}`}>
              {booking.status}
            </span>
          </div>

          <div className={classes.booking_details}>
            <div className={classes.detail}>
              <span className={classes.label}>Dates:</span>
              <span>{new Date(booking.start).toLocaleDateString()} - {new Date(booking.end).toLocaleDateString()}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Price:</span>
              <span>${booking.booking_variant.price}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Capacity:</span>
              <span>{booking.booking_variant.capacity} guests</span>
            </div>
            {booking.transaction && (
              <div className={classes.detail}>
                <span className={classes.label}>Transaction:</span>
                <span>${booking.transaction.amount} ({booking.transaction.transaction_status})</span>
              </div>
            )}
          </div>

          {booking.message && (
            <div className={classes.message}>
              <span className={classes.label}>Message:</span>
              <p>{booking.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

