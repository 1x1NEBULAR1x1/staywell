'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { useModelFilters } from '@/hooks/admin/actions/useModelFilters';
import { ReviewsFiltersMenu, ReviewsList } from './components';
import classes from '../Tab.module.scss';


export const ReviewsTab = ({ user_id }: { user_id: string }) => {
  const { filters, setFilters } = useModelFilters({
    model: 'REVIEW',
    permanent_fields: { user_id }
  });

  const { data: reviews } = useModel('REVIEW').get(filters);

  return (
    <div className={classes.tab}>
      <h2 className={classes.title}>Review History</h2>
      <div className={classes.section}>
        <div className={classes.header}>
          <h3 className={classes.title}>Reviews History</h3>
          <ReviewsFiltersMenu
            filters={filters}
            setFilters={setFilters}
          />
        </div>


        <ReviewsList reviews={reviews?.items || []} />
      </div>
    </div>
  );
};