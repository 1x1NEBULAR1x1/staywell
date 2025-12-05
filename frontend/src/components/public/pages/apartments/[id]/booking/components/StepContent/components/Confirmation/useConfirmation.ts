import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { useMemo } from "react";
import { useModel } from "@/hooks/admin/queries";
import { usePId } from "@/hooks/common/useId";
import { useBookingEvents } from "@/hooks/public";
import { useBookingAdditionalOptions } from "@/hooks/public/booking";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";

export const useConfirmation = ({
  initial_data,
}: {
  initial_data: ExtendedApartment;
}) => {
  const { data: apartment } = useModel("APARTMENT").find(usePId(), {
    initial_data: { data: initial_data },
  });

  const { selected_dates, selected_booking_variant_id } = useBookingStore();
  const { data: current_booking_variant, isLoading: isLoadingBookingVariant } =
    useModel("BOOKING_VARIANT").find(selected_booking_variant_id ?? "", {
      enabled: !!selected_booking_variant_id,
    });

  const { events, selected_events } = useBookingEvents();
  const { additional_options, selected_additional_options } =
    useBookingAdditionalOptions();

  // Calculate the number of nights
  const nights = useMemo(() => {
    if (!selected_dates.start || !selected_dates.end) return 0;
    return Math.ceil(
      (selected_dates.end.getTime() - selected_dates.start.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }, [selected_dates.start, selected_dates.end]);

  // Calculate the total cost
  const total_price: number = useMemo(() => {
    let price: number = 0;

    // Calculate base price (deposit + variant price * nights)
    if (
      apartment?.deposit !== undefined &&
      current_booking_variant?.price !== undefined &&
      nights >= 0
    ) {
      price = apartment.deposit + current_booking_variant.price * nights;
    }

    if (selected_events.length > 0 && events) {
      price += events.reduce((total, event) => {
        const selected_event = selected_events.find(
          (e) => e.event_id === event.id,
        );
        if (selected_event) {
          return total + event.price * selected_event.number_of_people;
        }
        return total;
      }, 0);
    }

    if (selected_additional_options.length > 0 && additional_options) {
      price += additional_options.reduce((total, option) => {
        const selected_option = selected_additional_options.find(
          (ao) => ao.additional_option_id === option.id,
        );
        if (selected_option) {
          return total + option.price * selected_option.amount;
        }
        return total;
      }, 0);
    }

    return price;
  }, [
    apartment?.deposit,
    current_booking_variant?.price,
    nights,
    selected_events,
    events,
    selected_additional_options,
    additional_options,
  ]);

  return {
    apartment,
    current_booking_variant,
    isLoadingBookingVariant,
    events,
    selected_events,
    additional_options,
    selected_additional_options,
    nights,
    total_price,
    selected_dates,
    selected_booking_variant_id,
  };
};
