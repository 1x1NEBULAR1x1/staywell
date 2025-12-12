import {
  EVENT_BOOKING_STEPS,
  type EventBookingStep,
} from "@/components/public/pages/events/[id]/booking/config";
import { useEventBookingStore } from "@/stores/public/pages/event-booking/useEventBookingStore";

export const useEventBookingState = () => {
  const { selected_participants_count } = useEventBookingStore();

  const canProceedToNextStep = (action: EventBookingStep): boolean => {
    switch (action) {
      case "selection":
        return selected_participants_count > 0;
      case "confirmation":
        return false;
      default:
        return false;
    }
  };

  const getNextStep = (current_step: EventBookingStep): EventBookingStep => {
    return EVENT_BOOKING_STEPS[EVENT_BOOKING_STEPS.indexOf(current_step) + 1];
  };

  const getPreviousStep = (
    current_step: EventBookingStep,
  ): EventBookingStep | null => {
    if (EVENT_BOOKING_STEPS.indexOf(current_step) === 0) return null;
    return EVENT_BOOKING_STEPS[EVENT_BOOKING_STEPS.indexOf(current_step) - 1];
  };

  return {
    canProceedToNextStep,
    getNextStep,
    getPreviousStep,
  };
};
