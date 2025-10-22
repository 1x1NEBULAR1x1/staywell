import classes from './ReservationsList.module.scss';
import { ExtendedReservation } from '@shared/src';

export const ReservationsList = ({ reservations }: { reservations: ExtendedReservation[] }) => {
  if (reservations.length === 0) {
    return <p className={classes.empty}>No reservations found</p>;
  }

  return (
    <div className={classes.reservations_list}>
      {reservations.map((reservation) => (
        <div key={reservation.id} className={classes.reservation_item}>
          <div className={classes.reservation_header}>
            <span className={classes.apartment_name}>
              {reservation.apartment.name || `Apartment ${reservation.apartment.number}`}
            </span>
          </div>

          <div className={classes.reservation_details}>
            <div className={classes.detail}>
              <span className={classes.label}>Dates:</span>
              <span>{new Date(reservation.start).toLocaleDateString()} - {new Date(reservation.end).toLocaleDateString()}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Floor:</span>
              <span>{reservation.apartment.floor}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Rooms:</span>
              <span>{reservation.apartment.rooms_count}</span>
            </div>
            <div className={classes.detail}>
              <span className={classes.label}>Capacity:</span>
              <span>{reservation.apartment.max_capacity || 'N/A'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

