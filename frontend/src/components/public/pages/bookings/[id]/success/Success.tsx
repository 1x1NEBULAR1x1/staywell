"use client";

import type { ExtendedBooking } from "@shared/src/types/bookings-section/extended.types";
import { useModel } from "@/hooks/admin/queries";
import { Header, PaymentLoader } from "../components";
import { SuccessMessage } from "./components";
import classes from "./Success.module.scss";

export const Success = ({
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
      <Header title={`Booking Success`} booking_id={booking_id} />
      {booking ? (
        <SuccessMessage booking={booking} />
      ) : (
        <PaymentLoader booking_id={booking_id} />
      )}
    </div>
  );
};
