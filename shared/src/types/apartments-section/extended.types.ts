import { Amenity, Apartment, ApartmentAmenity, BedType, Review, ApartmentBed, BookingVariant, Booking, Reservation, ApartmentImage, Prisma } from "../../database";
import { ExtendedBooking, ExtendedReservation } from "../bookings-section";
import { SAFE_USER_SELECT, SafeUser } from "../users-section";


export interface ExtendedAmenity extends Amenity {
  apartment_amenities: ApartmentAmenity[];
}


export const EXTENDED_APARTMENT_INCLUDE = {
  apartment_amenities: true,
} as const satisfies Prisma.ApartmentInclude;


export interface ExtendedApartmentAmenity extends ApartmentAmenity {
  amenity: Amenity;
}

export const EXTENDED_APARTMENT_AMENITY_INCLUDE = {
  amenity: true,
} as const satisfies Prisma.ApartmentAmenityInclude;


export interface ExtendedApartmentBed extends ApartmentBed {
  bed_type: BedType;
}

export const EXTENDED_APARTMENT_BED_INCLUDE = {
  bed_type: true,
} as const satisfies Prisma.ApartmentBedInclude;


export type ExtendedReview = Review & {
  user: SafeUser,
  apartment?: Apartment
}

export const EXTENDED_REVIEW_INCLUDE = {
  user: { select: SAFE_USER_SELECT },
  apartment: true,
} as const satisfies Prisma.ReviewInclude;


export type AvailableApartment = Apartment & {
  price: number;
  capacity: number;
  rating: number;
};

export type ExtendedApartment = AvailableApartment & {
  apartment_beds: (ApartmentBed & { bed_type: BedType })[];
  apartment_amenities: (ApartmentAmenity & { amenity: Amenity })[];
  images: ApartmentImage[];
  booking_variants: BookingVariant[];
  reviews: ExtendedReview[];
  cheapest_variant: BookingVariant | null;
  availability: ApartmentAvailabilityResult;
  reservations: ExtendedReservation[];
  bookings: ExtendedBooking[];
};

// Include for apartments is in buildApartmentInclude function 

export type ApartmentAvailabilityResult = {
  is_available: boolean;
  apartment: Apartment;
  reason?: string | null;
  reservations?: Reservation[];
  bookings?: Booking[];
};

export type ApartmentsData = {
  items: (Apartment & { booking_variants: BookingVariant[] })[];
  total: number;
};

export type ApartmentWithPrice = Apartment & {
  cheapest_variant: { id: string; price: number } | null;
};