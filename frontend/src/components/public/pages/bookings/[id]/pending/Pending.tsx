"use client";

import type { ExtendedBooking } from "@shared/src/types/bookings-section/extended.types";
import { useModel } from "@/hooks/admin/queries";
import { Header, PaymentLoader } from "../components";
import { PendingMessage } from "./components";
import classes from "./Pending.module.scss";

export const Pending = ({
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
      <Header title={`Booking Pending`} booking_id={booking_id} />
      {booking ? (
        <PendingMessage booking={booking} />
      ) : (
        <PaymentLoader booking_id={booking_id} />
      )}
    </div>
  );
};
