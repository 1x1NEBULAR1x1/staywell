import { BaseFiltersOptions, CreativeOmit } from "../../common";
import { AdditionalOption, Booking, BookingAdditionalOption, BookingStatus, BookingVariant, Reservation } from "../../database";
export type AdditionalOptionsFilters = BaseFiltersOptions<AdditionalOption> & {
    name?: string;
    description?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
};
export type CreateAdditionalOption = CreativeOmit<AdditionalOption> & {
    image?: string;
    file?: File;
};
export type UpdateAdditionalOption = Partial<CreateAdditionalOption> & {
    is_excluded?: boolean;
};
export type BookingAdditionalOptionsFilters = BaseFiltersOptions<BookingAdditionalOption> & {
    booking_id?: string;
    option_id?: string;
    min_amount?: number;
    max_amount?: number;
};
export type CreateBookingAdditionalOption = CreativeOmit<BookingAdditionalOption>;
export type UpdateBookingAdditionalOption = Partial<CreateBookingAdditionalOption>;
export type BookingVariantsFilters = BaseFiltersOptions<BookingVariant> & {
    min_price?: number;
    max_price?: number;
    min_capacity?: number;
    max_capacity?: number;
    is_available?: boolean;
    apartment_id?: string;
};
export type CreateBookingVariant = CreativeOmit<BookingVariant>;
export type UpdateBookingVariant = Partial<CreateBookingVariant>;
export type BookingsFilters = BaseFiltersOptions<Booking> & {
    status?: BookingStatus;
    min_start?: Date;
    max_start?: Date;
    min_end?: Date;
    max_end?: Date;
    user_id?: string;
    booking_variant_id?: string;
    transaction_id?: string;
};
export type CreateBooking = Omit<CreativeOmit<Booking>, "status" | "message"> & {
    message?: string;
};
export type UpdateBooking = Partial<CreateBooking> & {
    status?: BookingStatus;
};
export type ReservationsFilters = BaseFiltersOptions<Reservation> & {
    user_id?: string;
    apartment_id?: string;
    min_start?: Date;
    max_start?: Date;
    min_end?: Date;
    max_end?: Date;
};
export type CreateReservation = CreativeOmit<Reservation>;
export type UpdateReservation = Partial<CreateReservation>;
