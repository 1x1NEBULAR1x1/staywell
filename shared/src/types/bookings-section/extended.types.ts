import { AdditionalOption, Apartment, Booking, BookingAdditionalOption, BookingVariant, Reservation, Transaction } from "../../database";
import { SafeUser, UserWithoutPassword } from "../users-section";

export type ExtendedBookingAdditionalOption = BookingAdditionalOption & {
  additional_option: AdditionalOption;
};

export const EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = {
  additional_option: true,
};

export interface ExtendedBookingVariant extends BookingVariant {
  apartment: Apartment;
}

export const EXTENDED_BOOKING_VARIANT_INCLUDE = {
  apartment: true,
};



export type ExtendedBooking = Booking & {
  user: UserWithoutPassword;
  booking_variant: ExtendedBookingVariant;
  transaction?: Transaction;
  booking_additional_options: ExtendedBookingAdditionalOption[];
};

export const EXTENDED_BOOKING_INCLUDE = {
  user: true,
  booking_variant: { include: EXTENDED_BOOKING_VARIANT_INCLUDE },
  transaction: true,
  booking_additional_options: { include: EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE },
};

export interface ExtendedReservation extends Reservation {
  apartment: Apartment,
  user: SafeUser
}