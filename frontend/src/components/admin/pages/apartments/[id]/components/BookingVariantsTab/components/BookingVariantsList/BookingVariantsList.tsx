import classes from './BookingVariantsList.module.scss';

import { BookingVariant as BookingVariantType } from '@shared/src';
import { BookingVariant } from './components';

export const BookingVariantsList = ({ booking_variants }: { booking_variants: BookingVariantType[] }) => {

  return (
    <div className={classes.variants_list}>
      {booking_variants.length === 0 ? (
        <p className={classes.empty}>No booking variants configured</p>
      ) : (
        booking_variants.map((variant) => (
          <BookingVariant key={variant.id} booking_variant={variant} />
        ))
      )}
    </div>
  );
}