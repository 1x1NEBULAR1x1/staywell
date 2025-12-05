"use client";

import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useModel } from "@/hooks/admin/queries";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import { Content, Summary } from "./components";
import classes from "./Dates.module.scss";

export const Dates = ({
  initial_data,
}: {
  initial_data: ExtendedApartment;
}) => {
  const { id } = useParams<{ id: string }>();
  const {
    guests,
    selected_dates,
    selected_booking_variant_id,
    setSelectedBookingVariantId,
  } = useBookingStore();

  const { data: apartment } = useModel("APARTMENT").find(id, {
    initial_data: { data: initial_data },
  });

  // Auto-select suitable booking variant when dates or guests change
  useEffect(() => {
    if (apartment && (selected_dates.start || selected_dates.end)) {
      const suitable_variants = apartment.booking_variants.filter(
        (variant) => variant.capacity >= guests && variant.is_available,
      );

      if (suitable_variants.length > 0) {
        const current_variant = suitable_variants.find(
          (v) => v.id === selected_booking_variant_id,
        );
        if (!current_variant) {
          // Select the cheapest variant
          const cheapest_variant = suitable_variants.reduce(
            (cheapest, current) =>
              current.price < cheapest.price ? current : cheapest,
          );
          setSelectedBookingVariantId(cheapest_variant.id);
        }
      } else {
        setSelectedBookingVariantId(null);
      }
    }
  }, [
    apartment,
    guests,
    selected_dates.start,
    selected_dates.end,
    selected_booking_variant_id,
    setSelectedBookingVariantId,
  ]);

  return (
    apartment && (
      <div className={classes.container}>
        <Content apartment={apartment} guests={guests} />

        <Summary
          apartment={apartment}
          selected_dates={selected_dates}
          guests={guests}
        />
      </div>
    )
  );
};
