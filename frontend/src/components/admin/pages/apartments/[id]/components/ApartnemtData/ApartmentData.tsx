import classes from './ApartmentData.module.scss';

import { useState } from 'react';
import { useModel } from '@/hooks/admin/queries/useModel';
import { MetaData, MainData, Gallery, ApartmentBeds, ApartmentAmenities, EditApartmentModal } from './components';

export const ApartmentData = ({ apartment_id }: { apartment_id: string }) => {
  const { data: apartment, refetch } = useModel('APARTMENT').find(apartment_id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return apartment && (
    <>
      <div className={classes.header}>
        <div className={classes.main_info}>
          <Gallery apartment={apartment} />
          <div className={classes.info}>
            <MainData apartment={apartment} setIsEditModalOpen={setIsEditModalOpen} />
            <MetaData apartment={apartment} />
            <div className={classes.features}>
              <ApartmentBeds apartment={apartment} refetch={refetch} />
              <ApartmentAmenities apartment={apartment} refetch={refetch} />
            </div>
          </div>
        </div>
        <p className={classes.description}>{apartment.description}</p>
      </div>
      {isEditModalOpen && (
        <EditApartmentModal
          apartment={apartment}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}
    </>
  )
};