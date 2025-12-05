import {
  BadgeCheck,
  BadgePlus,
  BookmarkCheck,
  CalendarCheck,
  CalendarClock,
  NotebookPen,
  Ticket,
  TicketCheck,
} from "lucide-react";
import type { ElementType } from "react";
import type { BookingStep } from "../../config";

export type ProgressBarOption = {
  label: string;
  order: number;
  step: BookingStep;
  icon: ElementType;
  icon_completed: ElementType;
};

export const PROGRESS_BAR_OPTIONS: ProgressBarOption[] = [
  {
    label: "Dates",
    order: 1,
    step: "dates",
    icon: CalendarClock,
    icon_completed: CalendarCheck,
  },
  {
    label: "Event",
    order: 2,
    step: "events",
    icon: Ticket,
    icon_completed: TicketCheck,
  },
  {
    label: "Additional Options",
    order: 3,
    step: "additional_options",
    icon: BadgePlus,
    icon_completed: BadgeCheck,
  },
  {
    label: "Confirmation",
    order: 4,
    step: "confirmation",
    icon: NotebookPen,
    icon_completed: BookmarkCheck,
  },
];
