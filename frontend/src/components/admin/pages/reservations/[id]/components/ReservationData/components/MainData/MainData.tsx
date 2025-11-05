'use client';

import { useModel } from '@/hooks/admin/queries';
import classes from './MainData.module.scss';
import { usePId } from '@/hooks/common/useId';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface MainDataProps {
  setIsEditModalOpen: (isEditModalOpen: boolean) => void;
}

export const MainData = ({ setIsEditModalOpen }: MainDataProps) => {
  const { data: reservation } = useModel('RESERVATION').find(usePId());
  
  if (!reservation) return null;

  const now = new Date();
  const startDate = new Date(reservation.start);
  const endDate = new Date(reservation.end);
  
  const isActive = startDate <= now && now <= endDate;
  const isPast = endDate < now;
  const isFuture = startDate > now;

  return (
    <>
      <div className={classes.title_container}>
        <div className={classes.title_info}>
          <Calendar className={classes.calendar_icon} />
          <div className={classes.title_text}>
            <span className={classes.title}>
              Reservation #{reservation.id.slice(-8).toUpperCase()}
            </span>
            {isActive && <span className={classes.status_active}>Active Now</span>}
            {isPast && <span className={classes.status_past}>Completed</span>}
            {isFuture && <span className={classes.status_future}>Upcoming</span>}
          </div>
        </div>
        <button
          className={classes.edit_btn}
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Reservation
        </button>
      </div>
      <div className={classes.apartment_section}>
        <span className={classes.apartment_label}>Apartment:</span>
        <Link 
          href={`/admin/apartments/${reservation.apartment.id}`}
          className={classes.apartment_link}
        >
          {reservation.apartment.name || `Room #${reservation.apartment.number}`}
        </Link>
      </div>
    </>
  );
}