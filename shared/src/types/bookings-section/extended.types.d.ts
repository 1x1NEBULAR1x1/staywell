import { AdditionalOption, Apartment, Booking, BookingAdditionalOption, BookingVariant, Prisma, Reservation, Transaction } from "../../database";
import { UserWithoutPassword } from "../users-section";
export type ExtendedBookingAdditionalOption = BookingAdditionalOption & {
    additional_option: AdditionalOption;
};
export declare const EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE: {
    readonly additional_option: true;
};
export interface ExtendedBookingVariant extends BookingVariant {
    apartment: Apartment;
}
export declare const EXTENDED_BOOKING_VARIANT_INCLUDE: {
    readonly apartment: true;
};
export type ExtendedBooking = Booking & {
    user: UserWithoutPassword;
    booking_variant: ExtendedBookingVariant;
    transaction?: Transaction;
    booking_additional_options: ExtendedBookingAdditionalOption[];
};
export declare const EXTENDED_BOOKING_INCLUDE: {
    readonly user: {
        readonly select: Prisma.UserSelect<import("src/database/runtime/library").DefaultArgs>;
    };
    readonly transaction: true;
    readonly booking_additional_options: {
        readonly include: {
            readonly additional_option: true;
        };
    };
    readonly booking_variant: {
        readonly include: {
            readonly apartment: true;
        };
    };
};
export interface ExtendedReservation extends Reservation {
    apartment: Apartment;
    user: UserWithoutPassword;
}
export declare const EXTENDED_RESERVATION_INCLUDE: {
    readonly apartment: true;
    readonly user: {
        readonly select: Prisma.UserSelect<import("src/database/runtime/library").DefaultArgs>;
    };
};
