import { AdditionalOption, Amenity, Apartment, ApartmentAmenity, Review, ApartmentBed, ApartmentImage, BedType, Booking, BookingAdditionalOption, BookingVariant, Prisma, Reservation, Transaction } from "../../database";
import { ExtendedBookingEvent } from "../events-section/extended.types";
import { UserWithoutPassword } from "../users-section";
export type ExtendedBookingAdditionalOption = BookingAdditionalOption & {
    additional_option: AdditionalOption;
};
export declare const EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE: {
    readonly additional_option: true;
};
export interface ExtendedBookingVariant extends BookingVariant {
    apartment: Apartment & {
        images: ApartmentImage[];
        apartment_amenities: (ApartmentAmenity & {
            amenity: Amenity;
        })[];
        apartment_beds: (ApartmentBed & {
            bed_type: BedType;
        })[];
        reviews: Review[];
    };
}
export declare const EXTENDED_BOOKING_VARIANT_INCLUDE: {
    readonly apartment: {
        readonly include: {
            readonly images: true;
            readonly apartment_amenities: {
                readonly include: {
                    readonly amenity: true;
                };
            };
            readonly apartment_beds: {
                readonly include: {
                    readonly bed_type: true;
                };
            };
            readonly reviews: true;
        };
    };
};
export type ExtendedBooking = Booking & {
    user: UserWithoutPassword;
    booking_variant: ExtendedBookingVariant;
    transaction?: Transaction;
    booking_additional_options: ExtendedBookingAdditionalOption[];
    booking_events: ExtendedBookingEvent[];
};
export declare const EXTENDED_BOOKING_INCLUDE: {
    readonly booking_events: {
        readonly include: {
            readonly event: true;
        };
    };
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
            readonly apartment: {
                readonly include: {
                    readonly images: true;
                    readonly apartment_amenities: {
                        readonly include: {
                            readonly amenity: true;
                        };
                    };
                    readonly apartment_beds: {
                        readonly include: {
                            readonly bed_type: true;
                        };
                    };
                    readonly reviews: true;
                };
            };
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
