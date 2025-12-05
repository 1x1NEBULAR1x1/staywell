"use client";

import type { ExtendedBooking } from "@shared/src/types/bookings-section/extended.types";
import { useModel } from "@/hooks/admin/queries";
import classes from "./Booking.module.scss";
import {
  ApartmentCompactData,
  BookingSummary,
  EventsSection,
  FinalBookingSummary,
  Header,
  OptionsSection,
} from "./components";

export const Booking = ({
  booking_id,
  initial_data,
}: {
  booking_id: string;
  initial_data: ExtendedBooking;
}) => {
  const { data: booking } = useModel("BOOKING").find(booking_id, {
    initial_data: { data: initial_data },
  });

  return (
    <div className={classes.page}>
      <Header booking_id={booking_id} />

      {/* Main Content - Left: Apartment Data, Right: Booking Summary */}
      <div className={classes.main_content}>
        <ApartmentCompactData apartment={booking?.booking_variant.apartment} />
        <BookingSummary booking={booking} />
      </div>

      {/* Events Section - Horizontal Scroll with Summary */}
      <EventsSection booking_events={booking?.booking_events} />

      {/* Options Section - Horizontal Scroll with Summary */}
      <OptionsSection
        booking_additional_options={booking?.booking_additional_options}
      />

      {/* Final Booking Summary */}
      <FinalBookingSummary booking={booking} />
    </div>
  );
};
