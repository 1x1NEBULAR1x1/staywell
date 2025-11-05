'use client';

import { useState } from 'react';
import { ExtendedApartment } from '@shared/src';
import classes from './BookingVariantsTab.module.scss';
import { BookingVariantFornModal, BookingVariantsList } from './components';

export const BookingVariantsTab = ({ apartment }: { apartment: ExtendedApartment }) => {
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  return (
    <div className={classes.booking_variants_tab}>
      <div className={classes.header}>
        <div className={classes.header_content}>
          <h3 className={classes.title}>Booking Variants</h3>
          <p className={classes.subtitle}>
            Manage different booking options with various prices and capacities
          </p>
        </div>
        <button
          className={classes.add_button}
          onClick={() => setIsAddingVariant(!isAddingVariant)}
        >
          {isAddingVariant ? 'Cancel' : '+ Add Variant'}
        </button>
      </div>

      {isAddingVariant && (
        <BookingVariantFornModal onClose={() => setIsAddingVariant(false)} />
      )}

      <div className={classes.variants_section}>
        <BookingVariantsList booking_variants={apartment?.booking_variants || []} />
      </div>
    </div>
  );
};

