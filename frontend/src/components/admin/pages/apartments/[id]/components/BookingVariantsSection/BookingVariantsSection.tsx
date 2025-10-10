'use client';

import { useState } from 'react';
import { ExtendedApartment } from '@shared/src';
import classes from './BookingVariantsSection.module.scss';
import { BookingVariantFornModal } from './components/BookingVariantFornModal/BookingVariantFornModal';
import { BookingVariantsList } from './components/BookingVariantsList/BookingVariantsList';

export const BookingVariantsSection = ({ apartment, refetch }: { apartment: ExtendedApartment, refetch: () => void }) => {
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  return (
    <div className={classes.booking_variants}>
      <div className={classes.header}>
        <h3 className={classes.title}>Booking Variants</h3>
        <button
          className={classes.add_button}
          onClick={() => setIsAddingVariant(!isAddingVariant)}
        >
          {isAddingVariant ? 'Cancel' : '+ Add Variant'}
        </button>
      </div>

      {/* Add Variant Form */}
      {isAddingVariant && (
        <BookingVariantFornModal onClose={() => setIsAddingVariant(false)} apartment_id={apartment.id} refetch={refetch} />
      )}

      {/* Variants List */}
      <BookingVariantsList booking_variants={apartment.booking_variants} refetch={refetch} />
    </div>
  );
};
