'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { useModelFilters } from '@/hooks/admin/actions/useModelFilters';
import { ReservationsList, ReservationsFiltersMenu } from './components';
import classes from '../Tab.module.scss';


export const ReservationsTab = ({ user_id }: { user_id: string }) => {
  const { filters, setFilters } = useModelFilters({
    model: 'RESERVATION',
    permanent_fields: { user_id }
  });

  const { data: reservations } = useModel('RESERVATION').get(filters);


  return (
    <div className={classes.tab}>
      <h2 className={classes.title}>Reservation History</h2>
      <div className={classes.section}>
        <div className={classes.header}>
          <h3 className={classes.title}>Reservations History</h3>
          <ReservationsFiltersMenu
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        <ReservationsList reservations={reservations?.items || []} />
      </div>
    </div>
  );
};