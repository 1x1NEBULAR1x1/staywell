'use client';

import { useModel } from '@/hooks/admin/queries/useModel';
import { usePId } from '@/hooks/common/useId';
import classes from './Occupancy.module.scss';
import { Calendar, User as UserIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { Reservations, Bookings } from './components';


type OccupancyProps = {}

export const Occupancy = ({ }: OccupancyProps) => {
  const { data: apartment } = useModel('APARTMENT').find(usePId());

  // Filter active reservations and bookings
  const active_reservations = useMemo(() => {
    const now = new Date();
    return (apartment?.reservations || [])
      .filter((reservation) => new Date(reservation.end) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [apartment?.reservations]);

  const active_bookings = useMemo(() => {
    const now = new Date();
    return (apartment?.bookings || [])
      .filter((booking) => new Date(booking.end) >= now && ['PENDING', 'CONFIRMED'].includes(booking.status))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [apartment?.bookings]);

  const has_active_occupancy = active_reservations.length > 0 || active_bookings.length > 0;

  return has_active_occupancy && (
    <div className={classes.occupancy_section}>
      <h3 className={classes.section_title}>
        Active Reservations & Bookings
      </h3>

      <Reservations reservations={active_reservations} />
      <Bookings bookings={active_bookings} />
    </div>
  )
}