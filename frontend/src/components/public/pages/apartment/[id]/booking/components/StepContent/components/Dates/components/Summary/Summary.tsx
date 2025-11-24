'use client';

import classes from './Summary.module.scss';
import { ExtendedApartment } from '@shared/src/types/apartments-section/extended.types';
import { Dates, Section, BookingVariant, Pricing } from './components';
import { useSummary } from './useSummary';

interface SummaryProps {
  apartment: ExtendedApartment;
  selected_dates: { start?: Date; end?: Date };
  guests: number;
}

export const Summary = ({ apartment, selected_dates, guests }: SummaryProps) => {
  const {
    suitable_booking_variants,
    selected_booking_variant_id,
    setSelectedBookingVariantId,
    selected_booking_variant,
    nights,
    base_price,
    deposit,
    total_price,
  } = useSummary({ apartment });

  return (
    <div className={classes.summary}>
      <h3 className={classes.title}>Booking Summary</h3>

      <Section title="Selected Dates">
        {selected_dates.start && selected_dates.end ? (
          <Dates selected_dates={{ start: selected_dates.start, end: selected_dates.end }} nights={nights} />
        ) : (
          <span className={classes.placeholder}>Please select dates</span>
        )}
      </Section>

      <Section title="Guests">
        <span className={classes.guests_count}>{guests} guest{guests !== 1 ? 's' : ''}</span>
      </Section>

      <Section title="Booking Variant">
        {suitable_booking_variants.length > 0 ? (
          <BookingVariant
            suitable_booking_variants={suitable_booking_variants}
            selected_booking_variant_id={selected_booking_variant_id}
            setSelectedBookingVariantId={setSelectedBookingVariantId}
            selected_booking_variant={selected_booking_variant}
            nights={nights}
          />
        ) : (
          <span className={classes.error}>
            No suitable booking variant available for {guests} guests
          </span>
        )}
      </Section>

      <Pricing base_price={base_price} deposit={deposit} total_price={total_price} />
    </div>
  );
};
