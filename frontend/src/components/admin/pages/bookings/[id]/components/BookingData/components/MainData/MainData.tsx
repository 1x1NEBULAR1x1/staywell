import classes from './MainData.module.scss';
import { ExtendedBooking, BookingStatus } from '@shared/src';

const getStatusText = (status: BookingStatus) => {
  const statusMap = {
    PENDING: 'Pending Confirmation',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: BookingStatus) => {
  const classMap = {
    PENDING: classes.status_pending,
    CONFIRMED: classes.status_confirmed,
    COMPLETED: classes.status_completed,
    CANCELLED: classes.status_cancelled
  };
  return classMap[status] || '';
};

export const MainData = ({
  booking,
  setIsEditModalOpen
}: {
  booking: ExtendedBooking,
  setIsEditModalOpen: (isEditModalOpen: boolean) => void
}) => (
  <>
    <h1 className={classes.title_container}>
      <div className={classes.title_info}>
        <span className={classes.title}>
          Booking #{booking.id.slice(-8).toUpperCase()}
        </span>
        <span className={`${classes.status} ${getStatusClass(booking.status)}`}>
          {getStatusText(booking.status)}
        </span>
      </div>
      <button
        className={classes.edit_btn}
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit Booking
      </button>
    </h1>
    <div className={classes.apartment_name}>
      {booking.booking_variant.apartment.name} - Variant ${booking.booking_variant.price}/night
    </div>
  </>
);
