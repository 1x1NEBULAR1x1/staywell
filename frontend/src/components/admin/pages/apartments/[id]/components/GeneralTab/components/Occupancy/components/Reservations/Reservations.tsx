'use client';

import { Reservation, SafeUser } from '@shared/src';
import classes from './Reservations.module.scss';
import { Calendar, User as UserIcon, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

type ReservationsProps = {
  reservations: (Reservation & { user: SafeUser })[];
}

export const Reservations = ({ reservations }: ReservationsProps) => {
  if (reservations.length === 0) return null;

  return (
    <div className={classes.reservations_section}>
      <h4 className={classes.section_subtitle}>
        <Calendar size={18} />
        Active Reservations ({reservations.length})
      </h4>
      <div className={classes.reservations_list}>
        {reservations.map((reservation) => {
          const isCurrentReservation = new Date(reservation.start) <= new Date() && new Date() <= new Date(reservation.end);

          return (
            <div key={reservation.id} className={classes.reservation_item}>
              <div className={classes.reservation_header}>
                <div className={classes.user_info}>
                  <UserIcon size={16} />
                  <span className={classes.user_name}>
                    {reservation.user?.first_name} {reservation.user?.last_name}
                  </span>
                  {reservation.user?.email && (
                    <span className={classes.user_email}>{reservation.user.email}</span>
                  )}
                </div>
                <Link
                  href={`/admin/reservations/${reservation.id}`}
                  className={classes.view_link}
                >
                  <ExternalLink size={14} />
                  View Details
                </Link>
              </div>
              <div className={classes.reservation_dates}>
                <Clock size={14} />
                <span>
                  {format(new Date(reservation.start), 'MMM dd, yyyy')}
                  {' → '}
                  {format(new Date(reservation.end), 'MMM dd, yyyy')}
                </span>
                {isCurrentReservation && (
                  <span className={classes.current_badge}>Current</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};