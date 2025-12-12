"use client";

import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { BookingVariant, Dates, Pricing, Section } from "./components";
import classes from "./Summary.module.scss";
import { useSummary } from "./useSummary";

interface SummaryProps {
  apartment: ExtendedApartment;
  selected_dates: { start?: Date; end?: Date };
  guests: number;
}

export const Summary = ({
  apartment,
  selected_dates,
  guests,
}: SummaryProps) => {
  const {
    cheapest_variant,
    isLoadingSuitableBookingVariants,
    nights,
    base_price,
    deposit,
    total_price,
  } = useSummary({ apartment });

  return (
    <div className={classes.summary}>
      <h3 className={classes.title}>Booking Summary</h3>

      <div className={classes.booking_info}>
        <Section title="When">
          {selected_dates.start && selected_dates.end ? (
            <Dates
              selected_dates={{
                start: selected_dates.start,
                end: selected_dates.end,
              }}
              nights={nights}
            />
          ) : (
            <span className={classes.placeholder}>Please select dates</span>
          )}
        </Section>

        <Section title="Who & What">
          <div className={classes.guests_and_variant}>
            <div className={classes.guests}>
              <span className={classes.count}>
                {guests} guest{guests !== 1 ? "s" : ""}
              </span>
            </div>

            {!!selected_dates.start && !!selected_dates.end && (
              <div className={classes.variant}>
                {isLoadingSuitableBookingVariants ? (
                  <span className={classes.loading}>
                    Loading booking variants...
                  </span>
                ) : cheapest_variant ? (
                  <BookingVariant
                    booking_variant={cheapest_variant}
                    apartment={apartment}
                  />
                ) : (
                  <span className={classes.error}>
                    No suitable booking variant available for {guests} guests
                  </span>
                )}
              </div>
            )}
          </div>
        </Section>
      </div>

      <Section title="Cost Breakdown">
        <Pricing
          base_price={base_price}
          deposit={deposit}
          total_price={total_price}
        />
      </Section>
    </div>
  );
};
