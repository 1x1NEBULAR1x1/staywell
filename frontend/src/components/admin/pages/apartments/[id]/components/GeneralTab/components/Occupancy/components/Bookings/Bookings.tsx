'use client';

import { Booking, SafeUser } from '@shared/src';
import classes from './Bookings.module.scss';
import { Calendar, User as UserIcon, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

type BookingsProps = {
  bookings: (Booking & { user: SafeUser })[];
}

export const Bookings = ({ bookings }: BookingsProps) => {
  if (bookings.length === 0) return null;

  return (
    <div className={classes.bookings_section}>
      <h4 className={classes.section_subtitle}>
        <Calendar size={18} />
        Active Bookings ({bookings.length})
      </h4>
      <div className={classes.bookings_list}>
        {bookings.map((booking) => {
          const isCurrentBooking = new Date(booking.start) <= new Date() && new Date() <= new Date(booking.end);

          return (
            <div key={booking.id} className={classes.booking_item}>
              <div className={classes.booking_header}>
                <div className={classes.user_info}>
                  <UserIcon size={16} />
                  <span className={classes.user_name}>
                    {booking.user?.first_name} {booking.user?.last_name}
                  </span>
                  {booking.user?.email && (
                    <span className={classes.user_email}>{booking.user.email}</span>
                  )}
                </div>
                <div className={classes.header_actions}>
                  <span className={`${classes.status_badge} ${classes[`status_${booking.status.toLowerCase()}`]}`}>
                    {booking.status}
                  </span>
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className={classes.view_link}
                  >
                    <ExternalLink size={14} />
                    View Details
                  </Link>
                </div>
              </div>
              <div className={classes.booking_dates}>
                <Clock size={14} />
                <span>
                  {format(new Date(booking.start), 'MMM dd, yyyy')}
                  {' → '}
                  {format(new Date(booking.end), 'MMM dd, yyyy')}
                </span>
                {isCurrentBooking && (
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