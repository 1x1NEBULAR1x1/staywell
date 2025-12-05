import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useModel } from "@/hooks/admin/queries";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";

export const useSummary = ({ apartment }: { apartment: ExtendedApartment }) => {
  const { guests, selected_dates, setSelectedBookingVariantId } =
    useBookingStore();

  const router = useRouter();

  const {
    data: suitable_booking_variants,
    isLoading: isLoadingSuitableBookingVariants,
  } = useModel("BOOKING_VARIANT").get({
    take: 1,
    skip: 0,
    apartment_id: apartment.id,
    sort_field: "price",
    sort_direction: "asc",
    min_capacity: guests,
    is_available: true,
  });

  useEffect(() => {
    if (
      suitable_booking_variants?.items &&
      suitable_booking_variants.items.length > 0
    ) {
      setSelectedBookingVariantId(suitable_booking_variants.items[0].id);
    }
  }, [suitable_booking_variants, setSelectedBookingVariantId]);

  const cheapest_variant = suitable_booking_variants?.items[0] || null;

  const nights =
    selected_dates.start && selected_dates.end
      ? Math.ceil(
          (selected_dates.end.getTime() - selected_dates.start.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const base_price = cheapest_variant ? cheapest_variant.price * nights : 0;

  const deposit = apartment.deposit || 0;

  const total_price = base_price + deposit;

  const handleProceedToEvents = (_e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selected_dates.start || !selected_dates.end || !cheapest_variant)
      return;
    router.push(`/apartments/${apartment.id}/booking/1`);
  };

  const canProceedToEvents =
    selected_dates.start && selected_dates.end && cheapest_variant;

  return {
    cheapest_variant,
    nights,
    base_price,
    deposit,
    total_price,
    handleProceedToEvents,
    canProceedToEvents,
    isLoadingSuitableBookingVariants,
  };
};
