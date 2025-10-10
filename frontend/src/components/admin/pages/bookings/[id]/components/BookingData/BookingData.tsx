import classes from './BookingData.module.scss';

import { useState } from 'react';
import { ExtendedBooking } from '@shared/src';

import {
  MainData,
  MetaData,
  UserInfo,
  ApartmentInfo,
  TransactionInfo,
  AdditionalOptions,
  EditBookingModal
} from './components';

export const BookingData = ({ booking, refetch }: { booking: ExtendedBooking, refetch: () => void }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className={classes.header}>
        <div className={classes.main_info}>
          <div className={classes.info}>
            <MainData booking={booking} setIsEditModalOpen={setIsEditModalOpen} />
            <MetaData booking={booking} />

            <div className={classes.connections}>
              <UserInfo user={booking.user} />
              <ApartmentInfo apartment={booking.booking_variant.apartment} />
            </div>

            <div className={classes.additional_data}>
              <TransactionInfo transaction={booking.transaction} />
              <AdditionalOptions
                booking_additional_options={booking.booking_additional_options}
                booking_id={booking.id}
                refetch={refetch}
              />
            </div>
          </div>
        </div>

        {booking.message && (
          <div className={classes.message}>
            <h4>Client Message:</h4>
            <p>{booking.message}</p>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditBookingModal
          booking={booking}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}
    </>
  );
};