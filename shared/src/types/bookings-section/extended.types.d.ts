import { AdditionalOption, Apartment, Booking, BookingAdditionalOption, BookingVariant, Reservation, Transaction } from "../../database";
import { SafeUser, UserWithoutPassword } from "../users-section";
export type ExtendedBookingAdditionalOption = BookingAdditionalOption & {
    additional_option: AdditionalOption;
};
export declare const EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE: {
    additional_option: boolean;
};
export interface ExtendedBookingVariant extends BookingVariant {
    apartment: Apartment;
}
export declare const EXTENDED_BOOKING_VARIANT_INCLUDE: {
    apartment: boolean;
};
export type ExtendedBooking = Booking & {
    user: UserWithoutPassword;
    booking_variant: ExtendedBookingVariant;
    transaction?: Transaction;
    booking_additional_options: ExtendedBookingAdditionalOption[];
};
export declare const EXTENDED_BOOKING_INCLUDE: {
    user: boolean;
    booking_variant: {
        include: {
            apartment: boolean;
        };
    };
    transaction: boolean;
    booking_additional_options: {
        include: {
            additional_option: boolean;
        };
    };
};
export interface ExtendedReservation extends Reservation {
    apartment: Apartment;
    user: SafeUser;
}
