import classes from './MetaData.module.scss';
import { ExtendedBooking } from '@shared/src';
import { Calendar, Clock, Users, CreditCard } from 'lucide-react';

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const calculateNights = (start: Date | string, end: Date | string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatNights = (nights: number) => {
  return nights === 1 ? '1 night' : `${nights} nights`;
};

const calculateTotalAmount = (booking: ExtendedBooking) => {
  const nights = calculateNights(booking.start, booking.end);
  const basePrice = booking.booking_variant.price * nights;

  const optionsPrice = booking.booking_additional_options.reduce(
    (total, option) => total + (option.additional_option.price * option.amount),
    0
  );

  return basePrice + optionsPrice;
};

export const MetaData = ({ booking }: { booking: ExtendedBooking }) => {
  const nights = calculateNights(booking.start, booking.end);
  const totalAmount = calculateTotalAmount(booking);

  return (
    <div className={classes.meta}>
      <div className={classes.meta_row}>
        <div className={classes.date_info}>
          <Calendar className={classes.icon} />
          <div className={classes.date_details}>
            <span className={classes.date_range}>
              {formatDate(booking.start)} - {formatDate(booking.end)}
            </span>
            <span className={classes.nights}>
              {formatNights(nights)}
            </span>
          </div>
        </div>

        <div className={classes.capacity_info}>
          <Users className={classes.icon} />
          <span>up to {booking.booking_variant.capacity} guests</span>
        </div>
      </div>

      <div className={classes.meta_row}>
        <div className={classes.time_info}>
          <Clock className={classes.icon} />
          <span>Created: {formatDate(booking.created)}</span>
        </div>

        <div className={classes.price_info}>
          <CreditCard className={classes.icon} />
          <div className={classes.price_details}>
            <span className={classes.base_price}>
              ${booking.booking_variant.price} x {nights} nights
            </span>
            {booking.booking_additional_options.length > 0 && (
              <span className={classes.options_price}>
                + ${booking.booking_additional_options.reduce(
                  (total, option) => total + (option.additional_option.price * option.amount),
                  0
                )} (additional services)
              </span>
            )}
            <span className={classes.total_price}>
              Total: ${totalAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
