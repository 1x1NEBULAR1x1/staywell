import { Amenity, Apartment, ApartmentAmenity, BedType, Review, ApartmentBed, BookingVariant, Booking, Reservation, ApartmentImage } from "../../database";
import { SafeUser } from "../users-section";
export interface ExtendedAmenity extends Amenity {
    apartment_amenities: ApartmentAmenity[];
}
export interface ExtendedApartmentAmenity extends ApartmentAmenity {
    amenity: Amenity;
}
export interface ExtendedApartmentBed extends ApartmentBed {
    bed_type: BedType;
}
export type ExtendedReview = Review & {
    user: SafeUser;
    apartment: Apartment;
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
    reviews: Review[];
    cheapest_variant: BookingVariant | null;
    availability: ApartmentAvailabilityResult;
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
