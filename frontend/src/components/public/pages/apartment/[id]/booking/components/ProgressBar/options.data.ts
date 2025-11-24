import { ElementType } from "react";
import { CalendarClock, CalendarCheck, CreditCard, Ticket, TicketCheck, NotebookPen, BookmarkCheck, BookCheck } from 'lucide-react';
import { BookingStep } from '../../Booking';

export type ProgressBarOption = {
  label: string;
  order: number;
  step: BookingStep;
  icon: ElementType;
  icon_completed: ElementType;
}

export const PROGRESS_BAR_OPTIONS: ProgressBarOption[] = [
  {
    label: 'Dates',
    order: 1,
    step: 'dates',
    icon: CalendarClock,
    icon_completed: CalendarCheck,
  },
  {
    label: 'Event',
    order: 2,
    step: 'events',
    icon: Ticket,
    icon_completed: TicketCheck,
  },
  {
    label: 'Payment',
    order: 3,
    step: 'payment',
    icon: CreditCard,
    icon_completed: BookCheck,
  },
  {
    label: 'Confirmation',
    order: 4,
    step: 'confirmation',
    icon: NotebookPen,
    icon_completed: BookmarkCheck,
  }
]