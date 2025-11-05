'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { useModelFilters } from '@/hooks/admin/actions/useModelFilters';
import { BookingsFiltersMenu, BookingsList } from './components';
import classes from '../Tab.module.scss';


export const BookingsTab = ({ user_id }: { user_id: string }) => {
  const { filters, setFilters } = useModelFilters({
    model: 'BOOKING',
    permanent_fields: { user_id }
  });
  const { data: bookings } = useModel('BOOKING').get(filters);

  return (
    <div className={classes.tab}>
      <h2 className={classes.title}>Booking History</h2>
      <div className={classes.section}>
        <div className={classes.header}>
          <h3 className={classes.title}>Bookings History</h3>
          <BookingsFiltersMenu
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        <BookingsList bookings={bookings?.items || []} />
      </div>
    </div>
  );
};