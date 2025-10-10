import { Booking } from '@/components/admin/pages/bookings/[id]';

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (<Booking id={id} />);
}