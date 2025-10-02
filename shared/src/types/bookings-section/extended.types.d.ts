import { AdditionalOption, Apartment, Booking, BookingAdditionalOption, BookingVariant, Reservation, Transaction } from "../../database";
import { SafeUser, UserWithoutPassword } from "../users-section";
export type ExtendedBookingAdditionalOption = BookingAdditionalOption & {
    additional_option: AdditionalOption;
};
export interface ExtendedBookingVariant extends BookingVariant {
    apartment: Apartment;
}
export type ExtendedBooking = Booking & {
    user: UserWithoutPassword;
    booking_variant: ExtendedBookingVariant;
    transaction?: Transaction;
    booking_additional_options: ExtendedBookingAdditionalOption[];
};
export interface ExtendedReservation extends Reservation {
    apartment: Apartment;
    user: SafeUser;
}
