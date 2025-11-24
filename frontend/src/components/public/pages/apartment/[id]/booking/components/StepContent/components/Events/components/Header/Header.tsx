'use client'

import classes from './Header.module.scss';
import { Sparkles, CalendarOff } from 'lucide-react';
import { useBookingStore } from '@/stores/public/pages/booking/useBookingStore';
import { format } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const Header = () => {
  const { id } = useParams<{ id: string }>()
  const { selected_dates } = useBookingStore()

  return selected_dates.start && selected_dates.end
    ? <div className={classes.header}>
      <div className={classes.title}>
        <Sparkles size={24} />
        <h2>Select events</h2>
      </div>
      <p className={classes.subtitle}>
        Additional events during booking
      </p>

      <div className={classes.booking_period}>
        <span className={classes.period_label}>Booking dates:</span>
        <span className={classes.period_dates}>
          {format(selected_dates.start, 'dd MMM')} - {format(selected_dates.end, 'dd MMM')}
        </span>
      </div>
    </div>
    : <div className={classes.header}>
      <div className={classes.title}>
        <CalendarOff size={24} />
        <h2>Please select booking dates</h2>
      </div>
      <p className={classes.subtitle}>
        Please select booking dates to view available events
      </p>
      <Link
        href={`/apartments/${id}/booking/dates`}
        className={classes.back_button}
      >
        Back to select dates
      </Link>
    </div>
}