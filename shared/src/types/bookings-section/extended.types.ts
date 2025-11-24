import { AdditionalOption, Apartment, Booking, BookingAdditionalOption, BookingVariant, Prisma, Reservation, Transaction } from "../../database";
import { USER_WITHOUT_PASSWORD_SELECT, UserWithoutPassword } from "../users-section";

export type ExtendedBookingAdditionalOption = BookingAdditionalOption & {
  additional_option: AdditionalOption;
};

export const EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = {
  additional_option: true,
} as const satisfies Prisma.BookingAdditionalOptionInclude;

export interface ExtendedBookingVariant extends BookingVariant {
  apartment: Apartment;
}

export const EXTENDED_BOOKING_VARIANT_INCLUDE = {
  apartment: true,
} as const satisfies Prisma.BookingVariantInclude;



export type ExtendedBooking = Booking & {
  user: UserWithoutPassword;
  booking_variant: ExtendedBookingVariant;
  transaction?: Transaction;
  booking_additional_options: ExtendedBookingAdditionalOption[];
};

export const EXTENDED_BOOKING_INCLUDE = {
  user: { select: USER_WITHOUT_PASSWORD_SELECT },
  transaction: true,
  booking_additional_options: { include: EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE },
  booking_variant: { include: { apartment: true } },
} as const satisfies Prisma.BookingInclude;

export interface ExtendedReservation extends Reservation {
  apartment: Apartment,
  user: UserWithoutPassword
}

export const EXTENDED_RESERVATION_INCLUDE = {
  apartment: true,
  user: { select: USER_WITHOUT_PASSWORD_SELECT }
} as const satisfies Prisma.ReservationInclude;