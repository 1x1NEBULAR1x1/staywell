import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import { BOOKING_STEPS, BookingStep } from "@/components/public/pages/apartment/[id]/booking/Booking";



export const useBookingState = () => {
  const { selected_dates, selected_booking_variant_id } = useBookingStore();

  const canProceedToNextStep = (action: BookingStep): boolean => {
    switch (action) {
      case 'dates':
        return !!(selected_dates.start && selected_dates.end && selected_booking_variant_id);
      case 'events':
        return true;
      case 'payment':
        return true;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  const getNextStep = (current_step: BookingStep): BookingStep => {
    return BOOKING_STEPS[BOOKING_STEPS.indexOf(current_step) + 1];
  };

  const getPreviousStep = (current_step: BookingStep): BookingStep | null => {
    if (BOOKING_STEPS.indexOf(current_step) === 0) return null;
    return BOOKING_STEPS[BOOKING_STEPS.indexOf(current_step) - 1];
  };

  return {
    canProceedToNextStep,
    getNextStep,
    getPreviousStep,
  };
};