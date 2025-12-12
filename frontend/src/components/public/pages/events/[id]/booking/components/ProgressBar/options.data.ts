import { BadgeCheck, NotebookPen, UserCheck, Users } from "lucide-react";
import type { ElementType } from "react";
import type { EventBookingStep } from "../../config";

export type ProgressBarOption = {
  label: string;
  order: number;
  step: EventBookingStep;
  icon: ElementType;
  icon_completed: ElementType;
};

export const PROGRESS_BAR_OPTIONS: ProgressBarOption[] = [
  {
    label: "Selection",
    order: 1,
    step: "selection",
    icon: Users,
    icon_completed: UserCheck,
  },
  {
    label: "Confirmation",
    order: 2,
    step: "confirmation",
    icon: NotebookPen,
    icon_completed: BadgeCheck,
  },
];
