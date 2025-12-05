"use client";

import type { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
import type { ExtendedBooking } from "@shared/src/types/bookings-section/extended.types";
import { useModel } from "@/hooks/admin/queries";
import classes from "./Bookings.module.scss";
import { BookingList, Header } from "./components";

export const Bookings = ({
  initial_data,
}: {
  initial_data: BaseListResult<ExtendedBooking>;
}) => {
  const { data: bookings } = useModel("BOOKING").get(
    { take: 1000, skip: 0 },
    { initial_data: { data: initial_data } },
  );

  return (
    <div className={classes.page}>
      <Header title="My Bookings" />
      {bookings?.items && <BookingList bookings={bookings.items} />}
    </div>
  );
};
