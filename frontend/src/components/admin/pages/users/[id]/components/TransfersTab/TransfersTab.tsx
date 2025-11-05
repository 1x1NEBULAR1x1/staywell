'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { useModelFilters } from '@/hooks/admin/actions/useModelFilters';
import { TransferDetailsFiltersMenu, TransferDetailsList } from './components';
import classes from '../Tab.module.scss';


export const TransfersTab = ({ user_id }: { user_id: string }) => {
  const { filters, setFilters } = useModelFilters({
    model: 'TRANSFER_DETAIL',
    permanent_fields: { user_id }
  });

  const { data: transferDetails } = useModel('TRANSFER_DETAIL').get(filters);

  return (
    <div className={classes.tab}>
      <h2 className={classes.title}>Transfer Details</h2>
      <div className={classes.section}>
        <div className={classes.header}>
          <h3 className={classes.title}>Transfer Details</h3>
          <TransferDetailsFiltersMenu
            filters={filters}
            setFilters={setFilters}
          />
        </div>
        <TransferDetailsList transferDetails={transferDetails?.items || []} />
      </div>
    </div>
  );
};