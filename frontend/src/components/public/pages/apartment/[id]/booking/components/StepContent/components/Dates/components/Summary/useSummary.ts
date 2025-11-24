import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";


export const useSummary = ({ apartment }: { apartment: ExtendedApartment }) => {
  const { guests, selected_dates, selected_booking_variant_id, setSelectedBookingVariantId } = useBookingStore();
  const router = useRouter();
  const suitable_booking_variants = useMemo(() => apartment.booking_variants.filter(
    variant => variant.capacity >= guests && variant.is_available
  ), [apartment.booking_variants, guests]);

  const selected_booking_variant = suitable_booking_variants.find(v => v.id === selected_booking_variant_id) || null;

  const nights = selected_dates.start && selected_dates.end
    ? Math.ceil((selected_dates.end.getTime() - selected_dates.start.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const base_price = selected_booking_variant ? selected_booking_variant.price * nights : 0;

  const deposit = apartment.deposit || 0;

  const total_price = base_price + deposit;

  const handleProceedToEvents = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selected_dates.start || !selected_dates.end || !selected_booking_variant) return;
    router.push(`/apartments/${apartment.id}/booking/1`);
  }

  const canProceedToEvents = selected_dates.start && selected_dates.end && selected_booking_variant;


  return {
    suitable_booking_variants,
    selected_booking_variant_id,
    setSelectedBookingVariantId,
    selected_booking_variant,
    nights,
    base_price,
    deposit,
    total_price,
    handleProceedToEvents,
    canProceedToEvents,
  }
}