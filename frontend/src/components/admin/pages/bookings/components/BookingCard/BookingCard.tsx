import classes from './BookingCard.module.scss';
import no_image from '@/../public/common/no-image.jpeg';
import default_avatar from '@/../public/common/default-avatar.png';

import Image from 'next/image';
import { ExtendedBooking } from '@shared/src';
import { Shimmer } from '@/components/styles';
import Link from 'next/link';
import { EditIcon } from 'lucide-react';


export const BookingCard = ({ booking }: { booking: ExtendedBooking }) => {
  const calculateDaysDifference = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nightsCount = calculateDaysDifference(new Date(booking.start), new Date(booking.end));
  const pricePerNight = booking.booking_variant.price;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Логика редактирования
  };

  return (
    <div className={classes.booking_card}>
      <Link href={`/admin/bookings/${booking.id}`}>
        <div className={classes.booking_card_image_container}>
          <Image
            src={booking.booking_variant.apartment.image || no_image.src}
            alt="Apartment Image"
            width={400}
            height={300}
            quality={100}
            className={classes.booking_card_image}
          />
          <div className={classes.booking_card_price_badge}>
            ${pricePerNight} per night
          </div>
          <div className={classes.booking_card_image_overlay}>
            <h3 className={classes.booking_card_image_title}>
              {booking.booking_variant.apartment.name}
            </h3>
            <span className={classes.booking_card_image_subtitle}>
              {booking.booking_variant.apartment.floor} - {booking.booking_variant.apartment.number}
            </span>
          </div>
        </div>

        <div className={classes.booking_card_content}>
          <div className={classes.booking_card_dates}>
            <span>
              {new Date(booking.start).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date(booking.end).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </div>

          <div className={classes.booking_card_days}>
            {nightsCount} Days
          </div>

          <div className={classes.booking_card_message}>
            {booking.message || 'No message'}
          </div>

          <div className={classes.booking_card_user_section}>
            <Image
              src={booking.user.image || default_avatar.src}
              alt="User Avatar"
              width={450}
              height={450}
              quality={100}
              className={classes.booking_card_user_avatar}
            />
            <div className={classes.booking_card_user_details}>
              <span className={classes.booking_card_user_name}>
                {booking.user.first_name} {booking.user.last_name}
              </span>
              <span className={classes.booking_card_user_email}>
                {booking.user.email}
              </span>
            </div>
          </div>

          <div className={classes.booking_card_payment_section}>
            <div className={classes.booking_card_payment_item}>
              <span className={classes.booking_card_payment_label}>Initial Payment</span>
              <span className={classes.booking_card_payment_value}>${booking.transaction?.amount || 0}</span>
            </div>
            <div className={classes.booking_card_payment_item}>
              <span className={classes.booking_card_payment_label}>Total Payment</span>
              <span className={classes.booking_card_payment_value}>${pricePerNight * nightsCount}</span>
            </div>
          </div>

          <div className={classes.booking_card_footer}>
            <span className={`${classes.booking_card_status_badge} ${classes[`booking_card_status_${booking.status.toLowerCase()}`]}`}>
              {booking.status}
            </span>
            <button className={classes.booking_card_edit_button} onClick={handleEdit}>
              <EditIcon />
            </button>
          </div>
        </div>
      </Link>
    </div >
  );
}

export const BookingCardShimmer = () => {
  return (
    <div className={classes.booking_card}>
      <div className={classes.booking_card_image_container}>
        <Shimmer style={{ width: '100%', height: '200px' }} />
        <div className={classes.booking_card_price_badge}>
          <Shimmer style={{ width: '80px', height: '12px', borderRadius: '4px' }} />
        </div>
      </div>

      <div className={classes.booking_card_content}>
        <div className={classes.booking_card_dates}>
          <Shimmer style={{ width: '150px', height: '14px', borderRadius: '4px' }} />
        </div>

        <div className={classes.booking_card_days}>
          <Shimmer style={{ width: '60px', height: '14px', borderRadius: '4px' }} />
        </div>

        <div className={classes.booking_card_message}>
          <Shimmer style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '4px' }} />
        </div>

        <div className={classes.booking_card_user_section}>
          <Shimmer style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <div className={classes.booking_card_user_details}>
            <Shimmer style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
            <Shimmer style={{ width: '120px', height: '12px', borderRadius: '4px' }} />
          </div>
        </div>

        <div className={classes.booking_card_payment_section}>
          <div className={classes.booking_card_payment_item}>
            <Shimmer style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
            <Shimmer style={{ width: '50px', height: '14px', borderRadius: '4px' }} />
          </div>
          <div className={classes.booking_card_payment_item}>
            <Shimmer style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
            <Shimmer style={{ width: '50px', height: '14px', borderRadius: '4px' }} />
          </div>
        </div>

        <div className={classes.booking_card_footer}>
          <Shimmer style={{ width: '80px', height: '32px', borderRadius: '4px' }} />
          <Shimmer style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  );
}