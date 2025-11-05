'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { useModelFilters } from '@/hooks/admin/actions/useModelFilters';
import { EventsFiltersMenu, EventsList } from './components';
import classes from '../Tab.module.scss';

export const EventsTab = ({ user_id }: { user_id: string }) => {
  const { filters, setFilters } = useModelFilters({
    model: 'EVENT',
    permanent_fields: { guide_id: user_id }
  });

  const { data: events } = useModel('EVENT').get(filters);


  return (
    <div className={classes.tab}>
      <h2 className={classes.title}>Events History</h2>
      <div className={classes.section}>
        <div className={classes.header}>
          <h3 className={classes.title}>Events History</h3>
          <EventsFiltersMenu
            filters={filters}
            setFilters={setFilters}
            user_id={user_id}
          />
        </div>

        <EventsList events={events?.items || []} />
      </div>
    </div>
  );
};