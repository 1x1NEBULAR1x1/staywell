import { Check, Users } from "lucide-react";
import type { HeaderProps } from "./components/Header";

export type EventBookingStep = "selection" | "confirmation";

export const EVENT_BOOKING_STEPS: EventBookingStep[] = [
  "selection",
  "confirmation",
];

export const isEventBookingStep = (step: string): step is EventBookingStep => {
  return EVENT_BOOKING_STEPS.some((s) => s === step);
};

export const getHeaderProps = (step: EventBookingStep): HeaderProps => {
  switch (step) {
    case "selection":
      return {
        title: "Select number of participants",
        title_icon: <Users size={24} />,
        subtitle: "Choose how many people will attend the event",
      };
    case "confirmation":
      return {
        title: "Confirm booking",
        title_icon: <Check size={24} />,
        subtitle: "Review and confirm your event booking",
      };
  }
};
