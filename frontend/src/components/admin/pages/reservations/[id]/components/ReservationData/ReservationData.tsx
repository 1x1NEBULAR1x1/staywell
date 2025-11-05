'use client';

import classes from './ReservationData.module.scss';

import { useState } from 'react';
import { useModel } from '@/hooks/admin/queries';
import { usePId } from '@/hooks/common/useId';
import { MainData, MetaData, UserInfo, ApartmentInfo, EditReservationModal } from './components';

export const ReservationData = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: reservation, refetch } = useModel('RESERVATION').find(usePId());

  return !!reservation && (
    <>
      <div className={classes.header}>
        <div className={classes.main_info}>
          <div className={classes.info}>
            <MainData setIsEditModalOpen={setIsEditModalOpen} />
            <MetaData />

            <div className={classes.connections}>
              <UserInfo user={reservation.user} />
              <ApartmentInfo />
            </div>

            <div className={classes.additional_data}>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditReservationModal
          reservation={reservation}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}
    </>
  );
};