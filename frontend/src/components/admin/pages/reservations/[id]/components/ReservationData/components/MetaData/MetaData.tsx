'use client';

import { useModel } from '@/hooks/admin/queries';
import classes from './MetaData.module.scss';
import { Calendar, Clock, Users, CreditCard } from 'lucide-react';
import { usePId } from '@/hooks/common/useId';


const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const calculateNights = (start: Date | string, end: Date | string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatNights = (nights: number) => {
  return nights === 1 ? '1 night' : `${nights} nights`;
};

export const MetaData = () => {
  const { data: reservation } = useModel('RESERVATION').find(usePId());
  if (!reservation) return null;
  const nights = calculateNights(reservation.start, reservation.end);

  return (
    <div className={classes.meta}>
      <div className={classes.meta_row}>
        <div className={classes.date_info}>
          <Calendar className={classes.icon} />
          <div className={classes.date_details}>
            <span className={classes.date_range}>
              {formatDate(reservation.start)} - {formatDate(reservation.end)}
            </span>
            <span className={classes.nights}>
              {formatNights(nights)}
            </span>
          </div>
        </div>

        <div className={classes.capacity_info}>
          <Users className={classes.icon} />
          <span>up to {reservation.apartment.max_capacity} guests</span>
        </div>
      </div>

      <div className={classes.meta_row}>
        <div className={classes.time_info}>
          <Clock className={classes.icon} />
          <span>Created: {formatDate(reservation.created)}</span>
        </div>

        <div className={classes.price_info}>
          <CreditCard className={classes.icon} />
        </div>
      </div>
    </div>
  );
};
