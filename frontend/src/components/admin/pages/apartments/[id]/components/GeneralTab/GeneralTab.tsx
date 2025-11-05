'use client';

import classes from './GeneralTab.module.scss';
import { Header, Occupancy } from './components';
import { ExtendedApartment } from '@shared/src/types';

export const GeneralTab = ({ apartment }: { apartment: ExtendedApartment }) => {

  return (
    <>
      <div className={classes.general_tab}>
        {/* Header */}
        <Header />
        {/* Active Reservations & Bookings */}
        <Occupancy />

        {/* Description */}
        {apartment.description && (
          <div className={classes.description_section}>
            <h3 className={classes.section_title}>Description</h3>
            <p className={classes.description}>{apartment.description}</p>
          </div>
        )}

        {/* Rules */}
        {apartment.rules && (
          <div className={classes.description_section}>
            <h3 className={classes.section_title}>Apartment Rules</h3>
            <p className={classes.description}>{apartment.rules}</p>
          </div>
        )}
      </div>
    </>
  );
};

