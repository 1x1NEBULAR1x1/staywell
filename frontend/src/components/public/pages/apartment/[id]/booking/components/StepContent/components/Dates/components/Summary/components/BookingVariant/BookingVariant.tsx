import classes from './BookingVariant.module.scss';

import { BookingVariant as BookingVariantType } from '@shared/src/database';

type BookingVariantProps = {
  suitable_booking_variants: BookingVariantType[];
  selected_booking_variant_id: string | null;
  setSelectedBookingVariantId: (variant_id: string | null) => void;
  selected_booking_variant: BookingVariantType | null;
  nights: number;
}

export const BookingVariant = ({
  suitable_booking_variants,
  selected_booking_variant_id,
  setSelectedBookingVariantId,
  selected_booking_variant,
  nights
}: BookingVariantProps) => (
  <>
    {suitable_booking_variants.length > 1 && (
      <select
        className={classes.select}
        value={selected_booking_variant_id || ''}
        onChange={(e) => setSelectedBookingVariantId(e.target.value)}
      >
        {suitable_booking_variants.map((booking_variant) => (
          <option key={booking_variant.id} value={booking_variant.id}>
            {booking_variant.capacity} guests • ${booking_variant.price}/night
          </option>
        ))}
      </select>
    )}
    {selected_booking_variant && (
      <div className={classes.info}>
        <div className={classes.details}>
          <span className={classes.name}>
            {selected_booking_variant.capacity} guests • ${selected_booking_variant.price}/night
          </span>
          {suitable_booking_variants.length === 1 && (
            <span className={classes.note}>
              Only suitable option available
            </span>
          )}
        </div>
        <div className={classes.price}>
          ${selected_booking_variant.price.toFixed(2)} × {nights} nights = ${(selected_booking_variant.price * nights).toFixed(2)}
        </div>
      </div>
    )}
  </>
);