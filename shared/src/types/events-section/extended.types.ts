import { BookingEvent, Event, EventImage, Prisma } from "../../database";
import { SAFE_USER_SELECT, UserWithoutPassword } from "../users-section";


export type ExtendedBookingEvent = BookingEvent & {
  event: Event;
};

export const EXTENDED_BOOKING_EVENT_INCLUDE = {
  event: true,
} as const satisfies Prisma.BookingEventInclude;

export interface ExtendedEvent extends Event {
  guide?: UserWithoutPassword;
  images: EventImage[];
}

export const EXTENDED_EVENT_INCLUDE = {
  images: true,
  guide: { select: SAFE_USER_SELECT },
} as const satisfies Prisma.EventInclude;