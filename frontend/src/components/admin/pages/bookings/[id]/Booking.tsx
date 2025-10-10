'use client';
import { AdminPage } from '@/components/admin/common/AdminPage';
import { BookingData } from './components';
import { useModel } from '@/hooks/admin/queries/useModel';

export const Booking = ({ id }: { id: string }) => {
  const { data: booking, refetch } = useModel('BOOKING').find(id);
  if (!booking) return null;

  return (
    <AdminPage title='Booking Details'>
      <BookingData booking={booking} refetch={refetch} />
    </AdminPage>
  );
};