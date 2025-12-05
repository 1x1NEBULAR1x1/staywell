import { CalendarDays, Check, Plus, Sparkles } from "lucide-react";
import type { HeaderProps } from "./components";

export type BookingStep =
  | "dates"
  | "events"
  | "additional_options"
  | "confirmation";

export const BOOKING_STEPS: BookingStep[] = [
  "dates",
  "events",
  "additional_options",
  "confirmation",
];

export const isBookingStep = (step: string): step is BookingStep => {
  return BOOKING_STEPS.some((s) => s === step);
};

export const getHeaderProps = (step: BookingStep): HeaderProps => {
  switch (step) {
    case "dates":
      return {
        title: "Select check-in and check-out dates",
        title_icon: <CalendarDays size={24} />,
        subtitle: "Select a consecutive range of free days for booking",
      };
    case "events":
      return {
        title: "Select events",
        title_icon: <Sparkles size={24} />,
        subtitle: "Select additional events during booking",
      };
    case "additional_options":
      return {
        title: "Select additional options",
        title_icon: <Plus size={24} />,
        subtitle: "Select additional options",
      };
    case "confirmation":
      return {
        title: "Confirm booking",
        title_icon: <Check size={24} />,
        subtitle: "Confirm your booking",
      };
  }
};
