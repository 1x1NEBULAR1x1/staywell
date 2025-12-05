import { Prisma, Transaction } from "../../database";
import { USER_WITHOUT_PASSWORD_SELECT, UserWithoutPassword } from "../users-section";
import { EXTENDED_BOOKING_INCLUDE, ExtendedBooking } from "../bookings-section";
import { EXTENDED_BOOKING_EVENT_INCLUDE, ExtendedBookingEvent } from "../events-section";

export type ExtendedTransaction = Transaction & {
  user: UserWithoutPassword;
  booking?: ExtendedBooking
  booking_event?: ExtendedBookingEvent
};

export const EXTENDED_TRANSACTION_INCLUDE = {
  user: { select: USER_WITHOUT_PASSWORD_SELECT },
  booking: { include: EXTENDED_BOOKING_INCLUDE },
  booking_event: { include: EXTENDED_BOOKING_EVENT_INCLUDE },
} as const satisfies Prisma.TransactionInclude;