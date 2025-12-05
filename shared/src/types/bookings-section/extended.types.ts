import { AdditionalOption, Amenity, Apartment, ApartmentAmenity, Review, ApartmentBed, ApartmentImage, BedType, Booking, BookingAdditionalOption, BookingVariant, Prisma, Reservation, Transaction } from "../../database";
import { EXTENDED_BOOKING_EVENT_INCLUDE, ExtendedBookingEvent } from "../events-section/extended.types";
import { USER_WITHOUT_PASSWORD_SELECT, UserWithoutPassword } from "../users-section";

export type ExtendedBookingAdditionalOption = BookingAdditionalOption & {
  additional_option: AdditionalOption;
};

export const EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE = {
  additional_option: true,
} as const satisfies Prisma.BookingAdditionalOptionInclude;

export interface ExtendedBookingVariant extends BookingVariant {
  apartment: Apartment & {
    images: ApartmentImage[];
    apartment_amenities: (ApartmentAmenity & { amenity: Amenity })[];
    apartment_beds: (ApartmentBed & { bed_type: BedType })[];
    reviews: Review[];
  };
}

export const EXTENDED_BOOKING_VARIANT_INCLUDE = {
  apartment: {
    include: {
      images: true,
      apartment_amenities: { include: { amenity: true } },
      apartment_beds: { include: { bed_type: true } },
      reviews: true,
    },
  },
} as const satisfies Prisma.BookingVariantInclude;



export type ExtendedBooking = Booking & {
  user: UserWithoutPassword;
  booking_variant: ExtendedBookingVariant;
  transaction?: Transaction;
  booking_additional_options: ExtendedBookingAdditionalOption[];
  booking_events: ExtendedBookingEvent[];
};

export const EXTENDED_BOOKING_INCLUDE = {
  booking_events: {
    include: EXTENDED_BOOKING_EVENT_INCLUDE
  },
  user: { select: USER_WITHOUT_PASSWORD_SELECT },
  transaction: true,
  booking_additional_options: { include: EXTENDED_BOOKING_ADDITIONAL_OPTION_INCLUDE },
  booking_variant: { include: EXTENDED_BOOKING_VARIANT_INCLUDE },
} as const satisfies Prisma.BookingInclude;

export interface ExtendedReservation extends Reservation {
  apartment: Apartment,
  user: UserWithoutPassword
}

export const EXTENDED_RESERVATION_INCLUDE = {
  apartment: true,
  user: { select: USER_WITHOUT_PASSWORD_SELECT }
} as const satisfies Prisma.ReservationInclude;