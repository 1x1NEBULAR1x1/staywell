import { Amenity, Apartment, ApartmentAmenity, BedType, Review, ApartmentBed, BookingVariant, Booking, Reservation, ApartmentImage, Prisma } from "../../database";
import { ExtendedBooking, ExtendedReservation } from "../bookings-section";
import { SafeUser } from "../users-section";
export interface ExtendedAmenity extends Amenity {
    apartment_amenities: ApartmentAmenity[];
}
export declare const EXTENDED_APARTMENT_INCLUDE: {
    readonly apartment_amenities: true;
};
export interface ExtendedApartmentAmenity extends ApartmentAmenity {
    amenity: Amenity;
}
export declare const EXTENDED_APARTMENT_AMENITY_INCLUDE: {
    readonly amenity: true;
};
export interface ExtendedApartmentBed extends ApartmentBed {
    bed_type: BedType;
}
export declare const EXTENDED_APARTMENT_BED_INCLUDE: {
    readonly bed_type: true;
};
export type ExtendedReview = Review & {
    user: SafeUser;
    apartment?: Apartment;
};
export declare const EXTENDED_REVIEW_INCLUDE: {
    readonly user: {
        readonly select: Prisma.UserSelect<import("src/database/runtime/library").DefaultArgs>;
    };
    readonly apartment: true;
};
export type AvailableApartment = Apartment & {
    price: number;
    capacity: number;
    rating: number;
};
export type ExtendedApartment = AvailableApartment & {
    apartment_beds: (ApartmentBed & {
        bed_type: BedType;
    })[];
    apartment_amenities: (ApartmentAmenity & {
        amenity: Amenity;
    })[];
    images: ApartmentImage[];
    booking_variants: BookingVariant[];
    reviews: ExtendedReview[];
    cheapest_variant: BookingVariant | null;
    availability: ApartmentAvailabilityResult;
    reservations: ExtendedReservation[];
    bookings: ExtendedBooking[];
};
export type ApartmentAvailabilityResult = {
    is_available: boolean;
    apartment: Apartment;
    reason?: string | null;
    reservations?: Reservation[];
    bookings?: Booking[];
};
export type ApartmentsData = {
    items: (Apartment & {
        booking_variants: BookingVariant[];
    })[];
    total: number;
};
export type ApartmentWithPrice = Apartment & {
    cheapest_variant: {
        id: string;
        price: number;
    } | null;
};
