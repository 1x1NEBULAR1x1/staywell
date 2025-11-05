import classes from './ReservationCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';
import default_avatar from '@/../public/common/default-avatar.png';

import Image from 'next/image';
import { ExtendedReservation } from '@shared/src';
import { Shimmer } from '@/components/styles';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';


export const ReservationCard = ({ reservation }: { reservation: ExtendedReservation }) => {
  const calculateDaysDifference = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysCount = calculateDaysDifference(new Date(reservation.start), new Date(reservation.end));
  const now = new Date();
  const startDate = new Date(reservation.start);
  const endDate = new Date(reservation.end);

  // Determine reservation status
  const isActive = startDate <= now && now <= endDate;
  const isPast = endDate < now;
  const isFuture = startDate > now;

  return (
    <Link href={`/admin/reservations/${reservation.id}`} className={classes.reservation_card_link}>
      <div className={classes.reservation_card}>
        <div className={classes.image_section}>
          <Image
            src={reservation.apartment.image || no_image.src}
            alt={reservation.apartment.name || 'Apartment'}
            width={400}
            height={250}
            quality={100}
            className={classes.apartment_image}
          />
          <div className={classes.image_overlay}>
            <div className={classes.apartment_info}>
              <h3 className={classes.apartment_name}>
                {reservation.apartment.name || `Apartment #${reservation.apartment.number}`}
              </h3>
              <div className={classes.apartment_location}>
                <MapPin size={14} />
                <span>Floor {reservation.apartment.floor}, Room {reservation.apartment.number}</span>
              </div>
            </div>
            {isActive && (
              <div className={classes.status_badge_active}>Active Now</div>
            )}
            {isPast && (
              <div className={classes.status_badge_past}>Completed</div>
            )}
            {isFuture && (
              <div className={classes.status_badge_future}>Upcoming</div>
            )}
          </div>
        </div>

        <div className={classes.content_section}>
          <div className={classes.dates_section}>
            <div className={classes.date_item}>
              <Calendar size={16} />
              <div className={classes.date_details}>
                <span className={classes.date_label}>Check-in</span>
                <span className={classes.date_value}>{format(startDate, 'MMM dd, yyyy')}</span>
              </div>
            </div>
            <div className={classes.date_separator}>→</div>
            <div className={classes.date_item}>
              <Calendar size={16} />
              <div className={classes.date_details}>
                <span className={classes.date_label}>Check-out</span>
                <span className={classes.date_value}>{format(endDate, 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          <div className={classes.duration_section}>
            <Clock size={16} />
            <span>{daysCount} {daysCount === 1 ? 'day' : 'days'}</span>
          </div>

          <div className={classes.user_section}>
            <Image
              src={reservation.user.image || default_avatar.src}
              alt={`${reservation.user.first_name} ${reservation.user.last_name}`}
              width={40}
              height={40}
              className={classes.user_avatar}
            />
            <div className={classes.user_details}>
              <span className={classes.user_name}>
                {reservation.user.first_name} {reservation.user.last_name}
              </span>
              <span className={classes.user_email}>
                {reservation.user.email}
              </span>
            </div>
          </div>

          <div className={classes.footer_section}>
            <span className={classes.reservation_id}>ID: {reservation.id.slice(-8).toUpperCase()}</span>
            <span className={classes.created_date}>Created: {format(new Date(reservation.created), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const ReservationCardShimmer = () => {
  return (
    <div className={classes.reservation_card_link}>
      <div className={classes.reservation_card}>
        <div className={classes.image_section}>
          <Shimmer style={{ width: '100%', height: '250px', borderRadius: '8px 8px 0 0' }} />
        </div>

        <div className={classes.content_section}>
          <div className={classes.dates_section}>
            <Shimmer style={{ width: '100%', height: '60px', borderRadius: '8px' }} />
          </div>

          <div className={classes.duration_section}>
            <Shimmer style={{ width: '100px', height: '20px', borderRadius: '4px' }} />
          </div>

          <div className={classes.user_section}>
            <Shimmer style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <div className={classes.user_details}>
              <Shimmer style={{ width: '120px', height: '16px', borderRadius: '4px' }} />
              <Shimmer style={{ width: '150px', height: '14px', borderRadius: '4px' }} />
            </div>
          </div>

          <div className={classes.footer_section}>
            <Shimmer style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
            <Shimmer style={{ width: '120px', height: '14px', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}