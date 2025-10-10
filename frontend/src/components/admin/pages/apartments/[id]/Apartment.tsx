'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { ExtendedApartment } from '@shared/src';

import { BookingVariantsSection, ApartmentData } from './components';
import { AdminPage } from '@/components/admin/common/AdminPage';

export const Apartment = ({ id, initial_data }: { id: string, initial_data: ExtendedApartment }) => {
  const { data: apartment, refetch } = useModel('APARTMENT').find(id, { initial_data: { data: initial_data } });
  if (!apartment) return null;

  return (
    <AdminPage title='Apartment'>
      <ApartmentData apartment_id={id} />

      <BookingVariantsSection apartment={apartment} refetch={refetch} />
    </AdminPage>
  );
}