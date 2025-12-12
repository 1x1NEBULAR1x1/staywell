"use client";

import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import classes from "./Confirmation.module.scss";
import {
  Details,
  ErrorMessage,
  Header,
  LoadingMessage,
  ProcessButton,
  Summary,
  Terms,
} from "./components";
import { useConfirmation } from "./useConfirmation";

export const Confirmation = ({
  initial_data,
}: {
  initial_data: ExtendedApartment;
}) => {
  const {
    apartment,
    selected_dates,
    isLoadingBookingVariant,
    nights,
    total_price,
    selected_booking_variant_id,
  } = useConfirmation({ initial_data });

  if (
    !selected_dates.start ||
    !selected_dates.end ||
    !selected_booking_variant_id
  )
    return <ErrorMessage />;

  if (isLoadingBookingVariant) return <LoadingMessage />;

  return (
    <div className={classes.container}>
      <Header />

      <div className={classes.content}>
        {/* Booking details */}
        <Details apartment={apartment} />

        {/* Total price */}
        <Summary total_price={total_price} />

        {/* Booking terms */}
        <Terms />

        {/* Confirmation button */}
        <ProcessButton total_price={total_price} nights={nights} />
      </div>
    </div>
  );
};
