import type { CreateBooking } from "@shared/src/types/bookings-section";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  type CheckoutResponse,
  CheckoutsApi,
} from "@/lib/api/services/payments.api";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";

export const useBookingCheckout = (): UseMutationResult<
  CheckoutResponse | null,
  Error,
  void
> => {
  const api = new CheckoutsApi();
  const {
    selected_dates,
    selected_booking_variant_id,
    selected_events,
    selected_additional_options,
  } = useBookingStore();

  const data = useMemo<CreateBooking | null>(() => {
    if (
      !selected_dates.start ||
      !selected_dates.end ||
      !selected_booking_variant_id
    )
      return null;
    return {
      start: selected_dates.start.toISOString() as unknown as Date,
      end: selected_dates.end.toISOString() as unknown as Date,
      events: selected_events.map((e) => ({
        ...e,
        transaction_id: null,
        booking_id: null,
      })),
      additional_options: selected_additional_options,
      booking_variant_id: selected_booking_variant_id,
    };
  }, [
    selected_dates.start,
    selected_dates.end,
    selected_booking_variant_id,
    selected_events,
    selected_additional_options,
  ]);
  return useMutation({
    mutationFn: data
      ? () => api.booking(data).then((response) => response.data)
      : () => Promise.resolve(null),
    mutationKey: ["booking-checkout", data],
  });
};
